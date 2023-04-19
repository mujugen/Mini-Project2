function moveToProcessCompilePage() {
  if (globalUserArray.length == 0) {
    alert("Nothing to finalize");
    event.preventDefault();
  } else {
    localStorage.setItem("globalUserArray", JSON.stringify(globalUserArray));
    window.location.href = "process-compile.html";
  }
}

// Fetches user DB and returns array
async function fetchUserDBP() {
  try {
    const response = await fetch("/users");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const users = await response.json();
    /* console.log(users); */
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Checks whether user is in DB through rawText, returns applicant object if so
async function fetchApplicantByRawText(rawText) {
  console.log(`Checking if user exist in database`);
  const response = await fetch("/applicantByRawText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText }),
  });
  return response;
}

// Call CVSummarize API endpoint
async function fetchCVSummarize(pdfText) {
  try {
    const response = await fetch("/cvsummarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const applicant = await response.json();
    return { applicant, status: "success" };
  } catch (error) {
    console.error("Error fetching CV summary:", error);
    return { status: "error", message: error.message };
  }
}

var globalUserArray;
(async function initializeGlobalUserArray() {
  globalUserArray = await fetchUserDBP();
})();

let newUploadedFiles = [];

function displayUploadedFiles() {
  // Check if any files are selected
  if ($("#fileInput").val() === "") {
    alert("Please choose at least one file.");
    return;
  }

  let formData = new FormData();
  let files = $("#fileInput")[0].files;

  for (let i = 0; i < files.length; i++) {
    // Check if the file is a .pdf file
    if (files[i].name.toLowerCase().endsWith(".pdf")) {
      formData.append("files", files[i]);
    } else {
      alert("Only PDF files are allowed. Skipping non-PDF file.");
    }
  }

  // Send the uploaded files to the server
  $.ajax({
    url: "/upload",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      for (let i = 0; i < files.length; i++) {
        // Add a new row for each uploaded file
        addUploadedFile(files[i].name, files[i].size);
        newUploadedFiles.push(files[i].name);
      }
    },
    error: function () {
      alert("Failed to upload files.");
    },
  });
  toggleDarkOverlay("extractCard");
  toggleGlowOverlay("uploadDiv");
  toggleGlowOverlay("extractCard");
  this.removeAttribute("onclick");
}

function addUploadedFile(fileName, fileSize) {
  const formattedSize = (fileSize / (1024 * 1024)).toFixed(2) + " MB";
  const currentDate = new Date().toLocaleDateString("en-GB");

  const newRow = `<tr>
    <td>
      <div class="table-img">
        <i class="fa-solid fa-file-pdf fa-xl"></i>
      </div>
    </td>
    <td>
      <label>${fileName}</label>
    </td>
    <td>
      <label>${currentDate}</label>
    </td>
    <td>
      <label>${formattedSize}</label>
    </td>
  </tr>`;

  $("#rawPDFContainer").append(newRow);
}

// End of uploading files and displaying them

async function processPdf(blob) {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      try {
        const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
        const numPages = pdfDoc.numPages;
        let rawText = "";
        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          rawText += textContent.items.map((item) => item.str).join(" ");
        }
        resolve({ text: rawText });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(blob);
  });
}
async function convertUploadedFiles() {
  toggleSpinner();
  // Get the list of uploaded files from the server
  const response = await fetch("/list");
  const files = await response.json();
  globalUserArray = await fetchUserDBP();
  let functionSuccess = true;
  for (const file of files) {
    const filePath = `uploads/${file}`;
    let name = file;
    let applicant;
    try {
      const pdfBytes = await fetch(filePath).then((response) =>
        response.arrayBuffer()
      );
      const result = await processPdf(new Blob([pdfBytes]));
      var rawText = result.text;
      rawText = rawText.replace(//g, "");
      console.log("PDF converted to Raw Text");
      if (rawText.length > 10000) {
        rawText = rawText.substring(0, 8000) + "...";
      }
      // Check if rawText already exists in the database
      const response = await fetchApplicantByRawText(rawText);

      if (response.status === 404) {
        // If not found in the database, call fetchCVSummarize and logs user in db
        console.log("Applicant not found in DB");
        if (browsingMethod == "Offline") {
          console.log("Can't process applicant because you're in offline mode");
          continue;
        }
        applicant = await fetchCVSummarize(rawText);
        // If there's an error
        if (applicant.status === "error") {
          throwErrorPopup();
          functionSuccess = false;
          break;
        }

        // Update globalUserArray
        globalUserArray = await fetchUserDBP();
        // After the applicant object is retrieved, extract the name and create the new file path
        const newName = `${applicant.name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "")}.pdf`;
        const newPath = `uploads/${newName}`;
        // Call the new API endpoint to rename the file
        await fetch("/renameFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPath: filePath, newPath }),
        });
      } else {
        // If found in the database, use the returned applicant data
        console.log("Applicant found in DB");
        applicant = await response.json();
        /* console.log(applicant); */
        const newName = `${applicant.name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "")}.pdf`;
        const newPath = `uploads/${newName}`;
        // Call the new API endpoint to rename the file
        await fetch("/renameFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPath: filePath, newPath }),
        });
      }
    } catch (error) {
      console.error(`Error processing file: ${file}`, error);
    }
    if (rawText.length > 1000) {
      rawText = rawText.substring(0, 1000) + "...";
    }

    // Code to add to list #rawTextContainer
    const rawTextContainer = document.getElementById("rawTextContainer");
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = name;
    div.appendChild(h3);
    const p = document.createElement("p");
    p.textContent = rawText;
    div.appendChild(p);
    li.appendChild(div);
    rawTextContainer.appendChild(li);
  }
  if (functionSuccess) {
    console.log("Convert Uploaded Files Finished");
    toggleDarkOverlay("proceedCard");
    toggleGlowOverlay("proceedCard");
    toggleGlowOverlay("extractCard");
    toggleSpinner();
  } else {
    toggleSpinner();
  }
}
var browsingMethod = JSON.parse(localStorage.getItem("browsingMethod"));
var apiKeyValue = JSON.parse(sessionStorage.getItem("apiKeyValue"));
// Makes the upload button unusable when offline
if (browsingMethod == "Online") {
  toggleDarkOverlay("extractCard");
  toggleGlowOverlay("uploadDiv");
  /* toggleDarkOverlay("uploadDiv"); */
} else {
  toggleDarkOverlay("uploadDiv");
  toggleGlowOverlay("extractCard");
}
function toggleDarkOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".dark-overlay");

  if (existingOverlay) {
    element.removeChild(existingOverlay);
    element.style.pointerEvents = "auto";
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("dark-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.pointerEvents = "none";

  const borderRadius = window.getComputedStyle(element).borderRadius;
  if (borderRadius) {
    overlay.style.borderRadius = borderRadius;
  }

  element.style.position = "relative";
  element.style.pointerEvents = "none";
  element.appendChild(overlay);
}

toggleDarkOverlay("proceedCard");

function toggleGlowOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".glow-overlay");

  if (existingOverlay) {
    element.removeChild(existingOverlay);
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("glow-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "-1";

  overlay.style.boxShadow =
    "0 0 5px rgba(113, 73, 198, 0.2), 0 0 10px rgba(113, 73, 198, 0.2), 0 0 15px rgba(113, 73, 198, 0.2), 0 0 20px rgba(113, 73, 198, 0.2), 0 0 35px rgba(113, 73, 198, 0.2), 0 0 40px rgba(113, 73, 198, 0.2), 0 0 50px rgba(113, 73, 198, 0.2)";

  const borderRadius = window.getComputedStyle(element).borderRadius;
  if (borderRadius) {
    overlay.style.borderRadius = borderRadius;
  }

  element.style.position = "relative";
  element.appendChild(overlay);
}

let spinnerVisible = false;
let overlayVisible = false;
function toggleSpinner() {
  const spinner = document.getElementById("spinner");
  const body = document.getElementsByTagName("html")[0];

  if (!spinnerVisible) {
    spinner.style.display = "inline-block";
    body.classList.add("disable-pointer-events");
    spinner.style.float = "left";
    spinnerVisible = true;
  } else {
    spinner.style.display = "none";
    body.classList.remove("disable-pointer-events");
    spinnerVisible = false;
  }
  const overlay = document.getElementById("overlay");
  overlayVisible = !overlayVisible;

  if (overlayVisible) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}

async function initializeApiKey(apiKey) {
  try {
    const response = await fetch("/initialize-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API key initialized successfully:", data);
  } catch (error) {
    console.error("Error initializing API key:", error);
  }
}

initializeApiKey(apiKeyValue);

function throwErrorPopup() {
  for (const fileName of newUploadedFiles) {
    deleteFile(`uploads/${fileName}`);
  }
  // Reset the newUploadedFiles array
  newUploadedFiles = [];
  document.getElementById("popup_overlay").style.display = "flex";
}

document.getElementById("close_popup").addEventListener("click", function () {
  moveToHome();
});

function moveToHome() {
  window.location.href = "index.html";
}

async function deleteFile(filePath) {
  try {
    const response = await fetch("/deleteFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("File deleted successfully:", filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
