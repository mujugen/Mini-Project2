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
  const response = await fetch("http://localhost:3000/cvsummarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pdfText }),
  });
  const applicant = await response.json();
  return applicant;
}

var globalUserArray;
(async function initializeGlobalUserArray() {
  globalUserArray = await fetchUserDBP();
})();

function displayUploadedFiles() {
  // Check if any files are selected
  if ($("#fileInput").val() === "") {
    alert("Please choose at least one file.");
    return;
  }

  let formData = new FormData();
  let files = $("#fileInput")[0].files;

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  // Send the uploaded files to the server
  $.ajax({
    url: "http://localhost:3000/upload",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      for (let i = 0; i < files.length; i++) {
        // Add a new row for each uploaded file
        addUploadedFile(files[i].name, files[i].size);
      }
    },
    error: function () {
      alert("Failed to upload files.");
    },
  });
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
  // Get the list of uploaded files from the server
  const response = await fetch("http://localhost:3000/list");
  const files = await response.json();
  globalUserArray = await fetchUserDBP();
  for (const file of files) {
    const filePath = `uploads/${file}`;
    const name = file;
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
      let applicant;
      if (response.status === 404) {
        // If not found in the database, call fetchCVSummarize and logs user in db
        console.log("Applicant not found in DB");
        applicant = await fetchCVSummarize(rawText);
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
      let name = applicant.name;
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
    } catch (error) {
      console.error(`Error processing file: ${file}`, error);
    }
  }
  console.log("Convert Uploaded Files Finished");
}
