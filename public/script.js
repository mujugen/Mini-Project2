// Event listeners to load when document is ready
$(document).ready(function () {
  $("#uploadForm").on("submit", function (event) {
    event.preventDefault();

    // Check if any files are selected
    if ($("#fileInput").val() === "") {
      alert("Please choose at least one file.");
      return;
    }

    // Create a FormData object to hold the uploaded files data
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
      contentType: false,
      processData: false,
      success: function () {
        alert("Files uploaded successfully.");
      },
      error: function () {
        alert("Failed to upload files.");
      },
    });
  });
  // Event listener for convert button
  $("#convertBtn").on("click", function () {
    const parentDiv = document.getElementById("pdfContainers");
    let childDiv = parentDiv.querySelector("div");
    while (childDiv) {
      parentDiv.removeChild(childDiv);
      childDiv = parentDiv.querySelector("div");
    }
    console.log("Convert button clicked");
    convertUploadedFiles();
  });

  // Event listener for filter checkboxes
  $("#analyzeBtn").on("click", function () {
    console.log("Analyze button clicked");
    if (rawTexts.length === 0) {
      alert("Nothing to analyze");
      event.preventDefault();
    } else {
      runRedFlag();
    }
  });
  // Event listener for user parse button
  $("#parseBtn").on("click", function () {
    const parentDiv = document.getElementById("userContainers");
    let childDiv = parentDiv.querySelector("div");
    while (childDiv) {
      parentDiv.removeChild(childDiv);
      childDiv = parentDiv.querySelector("div");
    }
    console.log("Parse button clicked");
    if (rawTexts.length === 0) {
      alert("Nothing to to convert");
      event.preventDefault();
    } else {
      displayUserSummary();
    }
  });
  /* convertUploadedFiles(); */
});

var rawTexts = [];

// Function to convert PDF to text and returns raw text
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

// Function for Convert to Text Button
async function convertUploadedFiles() {
  // Get the list of uploaded files from the server
  const response = await fetch("http://localhost:3000/list");
  const files = await response.json();

  for (const file of files) {
    const filePath = `uploads/${file}`;
    const name = file;
    // Try to convert pdfs to text
    try {
      const pdfBytes = await fetch(filePath).then((response) =>
        response.arrayBuffer()
      );
      // Text == converted text from pdf
      const result = await processPdf(new Blob([pdfBytes]));
      var rawText = result.text;
      rawText = rawText.replace(//g, "");
      rawTexts.push(rawText); // Store the raw text in the global array
      /* console.log(rawText); */
      console.log("PDF converted to Raw Text");
      // Shortens text if longer than 10000 characters
      if (rawText.length > 10000) {
        rawTexts = rawText.substring(0, 9000) + "...";
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
      } else {
        // If found in the database, use the returned applicant data
        console.log("Applicant found in DB");
        applicant = await response.json();
        /* console.log(applicant); */
      }
      let name = applicant.name;
      if (rawText.length > 50) {
        shortText = rawText.substring(0, 400) + "...";
      }
      if (name != "") {
        // Create an HTML container for the raw text
        const container = $(`
      <div class="mb-5">
        <h3>${name}</h3>
        <div class="pdf-text"><b>Raw Text:</b> ${shortText}</div>
      </div>
    `);

        // Append the container to the page
        $("#pdfContainers").addClass("raw-text-cell");
        $("#pdfContainers").append(container);
      }
    } catch (error) {
      console.error(`Error processing file: ${file}`, error);
    }
  }
}

// Retrieves users array from DB
async function displayUserSummary() {
  let userArray = globalUserArray;
  // Create an HTML container for the raw text
  for (i = 0; i < userArray.length; i++) {
    container_id = "userContainers";
    addCardApplicant(container_id, userArray[i]);
  }
}

// Function to retrieve filter data
function getSelectedFilters() {
  var filters = [];
  const filterForm = document.getElementById("filterForm");
  for (let i = 0; i < filterForm.length; i++) {
    if (filterForm[i].checked) {
      filters.push(filterForm[i].value);
    }
  }
  return filters;
  /* console.log(filters); */
}
// Sends raw text and selected filter to receive red flag analysis in text form
async function fetchredFlagRemover(rawText, filters, name) {
  const response = await fetch("http://localhost:3000/redFlagRemover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText, filters, name }),
  });
  console.log("Response received");
  const redFlags = await response.json();
  if (response.status !== 200) {
    console.error(`Error: ${redFlags.error}`);
    return;
  }

  return redFlags;
}

async function runRedFlag() {
  filters = getSelectedFilters();
  if (filters.length != 0) {
    for (let i = 0; i < globalUserArray.length; i++) {
      let redFlags;
      if (globalUserArray[i].red_flag_1 == null) {
        console.log(
          `User ${globalUserArray[i].name} doesn't have red flags in DB`
        );
        redFlags = await fetchredFlagRemover(
          globalUserArray[i].raw_text,
          filters,
          globalUserArray[i].name
        );
      } else {
        console.log(`User ${globalUserArray[i].name} has red flags in DB`);
        redFlags = {
          red_flag_1: globalUserArray[i].red_flag_1,
          red_flag_2: globalUserArray[i].red_flag_2,
          red_flag_3: globalUserArray[i].red_flag_3,
          red_flag_4: globalUserArray[i].red_flag_4,
          red_flag_5: globalUserArray[i].red_flag_5,
          red_flag_6: globalUserArray[i].red_flag_6,
          red_flag_7: globalUserArray[i].red_flag_7,
          red_flag_8: globalUserArray[i].red_flag_8,
        };
      }

      let redFlag_title = document.createElement("p");
      let redFlag_content = document.createElement("p");
      redFlag_title.className = "cell-text-title";
      let container_id =
        "container_" + globalUserArray[i].name.replace(/ /g, "_");
      // Loop through redFlags object and check for values equal to 1
      for (let flag in redFlags) {
        if (redFlags[flag] == 1) {
          document.getElementById(container_id).style.backgroundColor = "red";
          switch (flag) {
            case "red_flag_1":
              redFlag_content.innerHTML += `Sloppy Formatting<br>`;
              break;
            case "red_flag_2":
              redFlag_content.innerHTML += `Lack of achievements<br>`;
              break;
            case "red_flag_3":
              redFlag_content.innerHTML += `Unexplained gaps in employment<br>`;
              break;
            case "red_flag_4":
              redFlag_content.innerHTML += `Job hopping<br>`;
              break;
            case "red_flag_5":
              redFlag_content.innerHTML += `Excessive grammar, spelling, and punctuation mistakes<br>`;
              break;
            case "red_flag_6":
              redFlag_content.innerHTML += `Usage of swear words<br>`;
              break;
            case "red_flag_7":
              redFlag_content.innerHTML += `Stagnant career<br>`;
              break;
            case "red_flag_8":
              redFlag_content.innerHTML += `Multiple career changes<br>`;
              break;
            default:
              break;
          }
        }
      }

      // Format the user name into the desired ID format

      let cell_text_id =
        "cell_text_" + globalUserArray[i].name.replace(/ /g, "_");
      document.getElementById(cell_text_id).appendChild(redFlag_title);
      // Append the redFlag_content element to the DOM using the formatted ID
      document.getElementById(cell_text_id).appendChild(redFlag_content);
    }
  } else {
    alert("No filters selected");
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

// Checks whether user is in DB through name, returns applicant object if so
async function fetchApplicantByname(name) {
  console.log(`Checking if user exist in database`);
  const response = await fetch("/applicantByName", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  return response;
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

var globalUserArray;

const fetchAndAssignUserArray = async () => {
  globalUserArray = await fetchUserDBP();
};

fetchAndAssignUserArray()
  .then(() => {
    console.log(globalUserArray);
  })
  .catch((error) => {
    console.error(error);
  });

/* Function to create reproducable cells */
function addCardApplicant(container_id, user) {
  /* Initialize where to put elements */
  const container = document.getElementById(container_id);
  /* Create elements */
  const cell = document.createElement("div");
  const cell_text = document.createElement("div");
  const name = document.createElement("p");
  const education = document.createElement("p");
  const experience = document.createElement("p");
  const skills = document.createElement("p");
  const certifications = document.createElement("p");
  const accomplishments = document.createElement("p");
  const name_content = document.createElement("p");
  const education_content = document.createElement("p");
  const experience_content = document.createElement("p");
  const skills_content = document.createElement("p");
  const certifications_content = document.createElement("p");
  const accomplishments_content = document.createElement("p");
  const img = document.createElement("img");
  var img_filename = "profile-placeholder.jpg";
  /* Set class names */
  cell.className = "p-2 cell";
  img.src = img_filename;
  img.className = "cell-img";
  cell_text.className = "cell-text-container";
  name.className = "cell-text-title";
  education.className = "cell-text-title";
  experience.className = "cell-text-title";
  skills.className = "cell-text-title";
  certifications.className = "cell-text-title";
  accomplishments.className = "cell-text-title";
  /* Text Title */
  name.textContent = "Name";
  education.textContent = "Education";
  experience.textContent = "Experience";
  skills.textContent = "Skills";
  certifications.textContent = "Certifications";
  accomplishments.textContent = "Accomplishments";
  // Text Content
  name_content.textContent = user.name ?? "N/A";
  education_content.textContent = user.education ?? "N/A";
  experience_content.textContent = user.experience ?? "N/A";
  skills_content.textContent = user.skills ?? "N/A";
  certifications_content.textContent = user.certifications ?? "N/A";
  accomplishments_content.textContent = user.accomplishments ?? "N/A";
  /* Set unique ID for the container using name_content */
  const containerUniqueId =
    "container_" + name_content.textContent.replace(/\s+/g, "_");
  cell.id = containerUniqueId;
  const cellTextUniqueId =
    "cell_text_" + name_content.textContent.replace(/\s+/g, "_");
  cell_text.id = cellTextUniqueId;
  /* Append all created elements */
  container.append(cell);
  cell.append(img, cell_text);
  cell_text.append(
    name,
    name_content,
    education,
    education_content,
    experience,
    experience_content,
    skills,
    skills_content,
    certifications,
    certifications_content,
    accomplishments,
    accomplishments_content
  );
}
