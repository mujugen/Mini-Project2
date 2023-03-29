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
      // Check if rawText already exists in the database
      const response = await fetch("http://localhost:3000/applicantByRawText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawText }),
      });

      let applicant;

      if (response.status === 404) {
        // If not found in the database, call fetchCVSummarize
        console.log("Applicant not found in DB");
        applicant = await fetchCVSummarize(rawText);
      } else {
        // If found in the database, use the returned applicant data
        console.log("Applicant found in DB");
        applicant = await response.json();
        /* console.log(applicant); */
      }
      const name = applicant.name;
      // Create an HTML container for the raw text
      const container = $(`
        <div class="pdf-container mt-4">
          <h3>${name}</h3>
          <div class="pdf-text"><b>Raw Text:</b> ${rawText}</div>
        </div>
      `);

      // Append the container to the page
      $("#pdfContainers").append(container);
    } catch (error) {
      console.error(`Error processing file: ${file}`, error);
    }
  }
}

// Retrieves users array from DB
async function displayUserSummary() {
  let userArray = await fetchUserDBP();
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
async function fetchredFlagRemover(rawText, filters) {
  const response = await fetch("http://localhost:3000/redFlagRemover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rawText, filters }),
  });
  const redFlagAnalysis = await response.json();
  return redFlagAnalysis;
}

// Run fetchredFlagRemover
async function runRedFlag() {
  filters = getSelectedFilters();
  /* console.log(filters);
  console.log(rawTexts); */
  if (filters.length != 0) {
    for (let i = 0; i < rawTexts.length; i++) {
      const analysis = await fetchredFlagRemover(rawTexts[i], filters);
      console.log(analysis);
      const container_id = "applicant-container";
      addCard(container_id, analysis);
    }
  } else {
    alert("No filters selected");
  }
}

/* Function to create reproducable cells */
function addCard(container_id, text) {
  /* Initialize where to put elements */
  const container = document.getElementById(container_id);
  /* Create elements */
  const cell = document.createElement("div");
  const cell_text = document.createElement("div");
  const img = document.createElement("img");
  var img_filename = "profile-placeholder.jpg";
  /* Set class names */
  cell.className = "p-2 cell";
  img.src = img_filename;
  img.className = "cell-img";
  cell_text.className = "cell-text-container";
  /* Append all created elements */
  container.append(cell);
  cell.append(img, cell_text);
  cell_text.innerHTML = text;
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
