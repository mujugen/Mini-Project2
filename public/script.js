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
    if (globalUserArray.length == 0) {
      alert("Nothing to analyze");
      event.preventDefault();
    } else {
      runRedFlag();
    }
  });
  // Event listener to remove those with RF
  $("#rfRemoveBtn").on("click", function () {
    console.log("RF Remove button clicked");
    if (globalUserArray.length == 0) {
      alert("Nothing to remove");
      event.preventDefault();
    } else {
      runRedFlagRemover();
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
    if (globalUserArray.length == 0) {
      alert("Nothing to to convert");
      event.preventDefault();
    } else {
      displayUserSummary();
    }
    $("#pdfContainers").remove();
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
  globalUserArray = await fetchUserDBP();
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
        updateSkillFilters();
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

async function runRedFlagRemover() {
  for (let i = 0; i < globalUserArray.length; i++) {
    let redFlags = {
      red_flag_1: globalUserArray[i].red_flag_1,
      red_flag_2: globalUserArray[i].red_flag_2,
      red_flag_3: globalUserArray[i].red_flag_3,
      red_flag_4: globalUserArray[i].red_flag_4,
      red_flag_5: globalUserArray[i].red_flag_5,
      red_flag_6: globalUserArray[i].red_flag_6,
      red_flag_7: globalUserArray[i].red_flag_7,
      red_flag_8: globalUserArray[i].red_flag_8,
    };

    let flagToRemove = false;
    let container_id =
      "#container_" + globalUserArray[i].name.replace(/ /g, "_");
    for (let flag in redFlags) {
      if (redFlags[flag] == 1) {
        $(container_id).remove();
        flagToRemove = true;
        break;
      }
    }

    if (flagToRemove) {
      globalUserArray.splice(i, 1);
      i--; // Decrement the index to compensate for the removed element
      updateSkillFilters();
    }
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
  updateSkillFilters();
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
  const certification = document.createElement("p");
  const accomplishments = document.createElement("p");
  const name_content = document.createElement("p");
  const education_content = document.createElement("p");
  const experience_content = document.createElement("p");
  const skills_content = document.createElement("p");
  const certification_content = document.createElement("p");
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
  certification.className = "cell-text-title";
  accomplishments.className = "cell-text-title";
  /* Text Title */
  name.innerHTML = "Name";
  education.innerHTML = "Education";
  experience.innerHTML = "Experience";
  skills.innerHTML = "Skills";
  certification.innerHTML = "Certifications";
  accomplishments.innerHTML = "Accomplishments";
  // Text Content
  name_content.innerHTML = user.name;
  if (user.education1FullTitle != "N/A") {
    education_content.innerHTML = user.education1FullTitle;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education1SchoolName;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education1YearEnded;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.education2FullTitle != "N/A") {
    education_content.innerHTML += user.education2FullTitle;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education2SchoolName;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education2YearEnded;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.education3FullTitle != "N/A") {
    education_content.innerHTML += user.education3FullTitle;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education3SchoolName;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.education3YearEnded;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperience1Title != "N/A") {
    experience_content.innerHTML = user.jobExperience1Title;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience1Company;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience1YearEnded;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperience2Title != "N/A") {
    experience_content.innerHTML += user.jobExperience2Title;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience2Company;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience2YearEnded;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperience3Title != "N/A") {
    experience_content.innerHTML += user.jobExperience3Title;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience3Company;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperience3YearEnded;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.programmingLanguage1 != "N/A") {
    skills_content.innerHTML = user.programmingLanguage1;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.programmingLanguage2 != "N/A") {
    skills_content.innerHTML += user.programmingLanguage2;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.programmingLanguage3 != "N/A") {
    skills_content.innerHTML += user.programmingLanguage3;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.programmingLanguage4 != "N/A") {
    skills_content.innerHTML += user.programmingLanguage4;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.programmingLanguage5 != "N/A") {
    skills_content.innerHTML += user.programmingLanguage5;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.certification1Title != "N/A") {
    certification_content.innerHTML = user.certification1Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification2Title != "N/A") {
    certification_content.innerHTML += user.certification2Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification3Title != "N/A") {
    certification_content.innerHTML += user.certification3Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification4Title != "N/A") {
    certification_content.innerHTML += user.certification4Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification5Title != "N/A") {
    certification_content.innerHTML += user.certification5Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment1Title != "N/A") {
    accomplishments_content.innerHTML = user.accomplishment1Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment2Title != "N/A") {
    accomplishments_content.innerHTML += user.accomplishment2Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment3Title != "N/A") {
    accomplishments_content.innerHTML += user.accomplishment3Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment4Title != "N/A") {
    accomplishments_content.innerHTML += user.accomplishment4Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment5Title != "N/A") {
    accomplishments_content.innerHTML += user.accomplishment5Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (!accomplishments_content.textContent.trim()) {
    accomplishments_content.innerHTML = "N/A";
  }
  if (!certification_content.textContent.trim()) {
    certification_content.innerHTML = "N/A";
  }
  if (!skills_content.textContent.trim()) {
    skills_content.innerHTML = "N/A";
  }
  if (!experience_content.textContent.trim()) {
    experience_content.innerHTML = "N/A";
  }
  if (!education_content.textContent.trim()) {
    education_content.innerHTML = "N/A";
  }
  if (!name_content.textContent.trim()) {
    name_content.innerHTML = "N/A";
  }
  /* Set unique ID for the container using name_content */
  const containerUniqueId =
    "container_" + name_content.innerHTML.replace(/\s+/g, "_");
  cell.id = containerUniqueId;
  const cellTextUniqueId =
    "cell_text_" + name_content.innerHTML.replace(/\s+/g, "_");
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
    certification,
    certification_content,
    accomplishments,
    accomplishments_content
  );
}

function getAvailableSkills(globalUserArray) {
  const availableSkills = new Set();

  globalUserArray.forEach((user) => {
    for (let i = 1; i <= 5; i++) {
      const skillKey = `programmingLanguage${i}`;
      if (skillKey in user) {
        availableSkills.add(user[skillKey]);
      }
    }
  });

  return Array.from(availableSkills);
}

// Function to retrieve filter data
function getSelectedSkillFilters() {
  let filters = [];
  const filterForm = document.getElementById("skillFilterForm");
  for (let i = 0; i < filterForm.length; i++) {
    if (filterForm[i].checked) {
      filters.push(filterForm[i].value);
    }
  }
  return filters;
  /* console.log(filters); */
}

/* Function to create reproducable cells */
function addSkillFormGroup(skill) {
  container_id = "skillFilterForm";
  const container = document.getElementById(container_id);
  /* Create elements */
  const form_group = document.createElement("div");
  form_group.className = "form-group";
  const form_check = document.createElement("div");
  form_check.className = "form-check";
  const input = document.createElement("input");
  input.className = "form-check-input";
  input.type = "checkbox";
  input.value = skill;
  input.onchange = function () {
    const parentDiv = document.getElementById("userContainers");
    let childDiv = parentDiv.querySelector("div");
    while (childDiv) {
      parentDiv.removeChild(childDiv);
      childDiv = parentDiv.querySelector("div");
    }
    console.log("Parse button clicked");
    if (globalUserArray.length == 0) {
      alert("Nothing to to convert");
      event.preventDefault();
    } else {
      displayUserSummary();
    }
    getSelectedSkillFilters();
    removeUnskilledApplicants();
  };
  const label = document.createElement("label");
  label.className = "form-check-label";
  label.textContent = skill;
  /* Append all created elements */
  container.append(form_check);
  form_check.append(input, label);
}

function updateSkillFilters() {
  const parentDiv = document.getElementById("skillFilterForm");
  let childDiv = parentDiv.querySelector("div");
  while (childDiv) {
    parentDiv.removeChild(childDiv);
    childDiv = parentDiv.querySelector("div");
  }
  availableSkills = getAvailableSkills(globalUserArray);
  for (skill in availableSkills) {
    const skillName = availableSkills[skill];
    addSkillFormGroup(skillName);
  }
}
function hasSelectedLanguages(globalUserArray, filters, userID) {
  for (let i = 0; i < filters.length; i++) {
    let filterFound = false;

    for (let j = 0; j < 5; j++) {
      const skillKey = `programmingLanguage${j + 1}`;

      if (globalUserArray[userID][skillKey] === filters[i]) {
        filterFound = true;
        break;
      }
    }

    if (!filterFound) {
      return false;
    }
  }

  return true;
}

function removeUnskilledApplicants() {
  filters = getSelectedSkillFilters();
  for (let i = 0; i < globalUserArray.length; i++) {
    if (!hasSelectedLanguages(globalUserArray, filters, i)) {
      let container_id =
        "#container_" + globalUserArray[i].name.replace(/ /g, "_");
      $(container_id).remove();
    }
  }
}
