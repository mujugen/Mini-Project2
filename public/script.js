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
  // Event listener to finalize selection and move to next page
  $("#finalizeBtn").on("click", function () {
    console.log("Finalize button clicked");
    selectedApplicants = retrieveSelectedApplicants();
    if (selectedApplicants.length == 0) {
      alert("Nothing to finalize");
      event.preventDefault();
    } else {
      // Send to other page with list of selected applicants
    }
  });
  displaySelectedFilter();
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
  selectedApplicants = retrieveSelectedApplicants();
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

        updateItemFilters(
          globalUserArray,
          "skill",
          5,
          "skillFilterForm",
          skillFilterCallback
        );
        updateItemFilters(
          globalUserArray,
          "educationFullTitle",
          3,
          "educationFilterForm",
          educationFilterCallback
        );
        updateItemFilters(
          globalUserArray,
          "jobExperienceTitle",
          5,
          "experienceFilterForm",
          experienceFilterCallback
        );
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
  globalUserArray = await fetchUserDBP();
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
        "container_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
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
        "cell_text_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      document.getElementById(cell_text_id).appendChild(redFlag_title);
      // Append the redFlag_content element to the DOM using the formatted ID
      document.getElementById(cell_text_id).appendChild(redFlag_content);
    }
  } else {
    alert("No filters selected");
  }
}

async function runRedFlagRemover() {
  globalUserArray = await fetchUserDBP();
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
      "#container_" +
      globalUserArray[i].name
        .replace(/ /g, "_")
        .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
    for (let flag in redFlags) {
      if (redFlags[flag] == 1) {
        flagToRemove = true;
        break;
      }
    }

    if (flagToRemove) {
      $(container_id).remove();
      globalUserArray.splice(i, 1);
      i--; // Decrement the index to compensate for the removed element
      updateItemFilters(
        globalUserArray,
        "skill",
        5,
        "skillFilterForm",
        skillFilterCallback
      );
      updateItemFilters(
        globalUserArray,
        "educationFullTitle",
        3,
        "educationFilterForm",
        educationFilterCallback
      );
      updateItemFilters(
        globalUserArray,
        "jobExperienceTitle",
        5,
        "experienceFilterForm",
        experienceFilterCallback
      );
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
  updateItemFilters(
    globalUserArray,
    "skill",
    5,
    "skillFilterForm",
    skillFilterCallback
  );
  updateItemFilters(
    globalUserArray,
    "educationFullTitle",
    3,
    "educationFilterForm",
    educationFilterCallback
  );
  updateItemFilters(
    globalUserArray,
    "jobExperienceTitle",
    5,
    "experienceFilterForm",
    experienceFilterCallback
  );
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
  name.innerHTML = `Name`;
  education.innerHTML = `<hr style="height:2px;border-width:0;color:gray;background-color:gray">Education`;
  experience.innerHTML = `<hr style="height:2px;border-width:0;color:gray;background-color:gray">Experience`;
  skills.innerHTML = `<hr style="height:2px;border-width:0;color:gray;background-color:gray">Skills`;
  certification.innerHTML = `<hr style="height:2px;border-width:0;color:gray;background-color:gray">Certifications`;
  accomplishments.innerHTML = `<hr style="height:2px;border-width:0;color:gray;background-color:gray">Accomplishments`;
  // Text Content
  name_content.innerHTML = user.name;
  if (user.educationFullTitle1 != "N/A" && user.educationFullTitle1 != "") {
    education_content.innerHTML = user.educationFullTitle1;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationSchoolName1;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationYearEnded1;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.educationFullTitle2 != "N/A" && user.educationFullTitle2 != "") {
    education_content.innerHTML += user.educationFullTitle2;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationSchoolName2;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationYearEnded2;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.educationFullTitle3 != "N/A" && user.educationFullTitle3 != "") {
    education_content.innerHTML += user.educationFullTitle3;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationSchoolName3;
    education_content.innerHTML += "<br>";
    education_content.innerHTML += user.educationYearEnded3;
    education_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperienceTitle1 != "N/A" && user.jobExperienceTitle1 != "") {
    experience_content.innerHTML = user.jobExperienceTitle1;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceCompany1;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceYearEnded1;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperienceTitle2 != "N/A" && user.jobExperienceTitle2 != "") {
    experience_content.innerHTML += user.jobExperienceTitle2;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceCompany2;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceYearEnded2;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.jobExperienceTitle3 != "N/A" && user.jobExperienceTitle3 != "") {
    experience_content.innerHTML += user.jobExperienceTitle3;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceCompany3;
    experience_content.innerHTML += "<br>";
    experience_content.innerHTML += user.jobExperienceYearEnded3;
    experience_content.innerHTML += "<br><hr>";
  }
  if (user.skill1 != "N/A" && user.skill1 != "") {
    skills_content.innerHTML = user.skill1;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.skill2 != "N/A" && user.skill2 != "") {
    skills_content.innerHTML += user.skill2;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.skill3 != "N/A" && user.skill3 != "") {
    skills_content.innerHTML += user.skill3;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.skill4 != "N/A" && user.skill4 != "") {
    skills_content.innerHTML += user.skill4;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.skill5 != "N/A" && user.skill5 != "") {
    skills_content.innerHTML += user.skill5;
    skills_content.innerHTML += "<br><hr>";
  }
  if (user.certification1Title != "N/A" && user.certification1Title != "") {
    certification_content.innerHTML = user.certification1Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification2Title != "N/A" && user.certification2Title != "") {
    certification_content.innerHTML += user.certification2Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification3Title != "N/A" && user.certification3Title != "") {
    certification_content.innerHTML += user.certification3Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification4Title != "N/A" && user.certification4Title != "") {
    certification_content.innerHTML += user.certification4Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.certification5Title != "N/A" && user.certification5Title != "") {
    certification_content.innerHTML += user.certification5Title;
    certification_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment1Title != "N/A" && user.accomplishment1Title != "") {
    accomplishments_content.innerHTML = user.accomplishment1Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment2Title != "N/A" && user.accomplishment2Title != "") {
    accomplishments_content.innerHTML += user.accomplishment2Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment3Title != "N/A" && user.accomplishment3Title != "") {
    accomplishments_content.innerHTML += user.accomplishment3Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment4Title != "N/A" && user.accomplishment4Title != "") {
    accomplishments_content.innerHTML += user.accomplishment4Title;
    accomplishments_content.innerHTML += "<br><hr>";
  }
  if (user.accomplishment5Title != "N/A" && user.accomplishment5Title != "") {
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
  $(skills_content).find("hr:last").remove();
  $(experience_content).find("hr:last").remove();
  $(education_content).find("hr:last").remove();
  $(certification_content).find("hr:last").remove();
  $(accomplishments_content).find("hr:last").remove();
  /* Set unique ID for the container using name_content */
  const containerUniqueId =
    "container_" +
    name_content.innerHTML
      .replace(/ /g, "_")
      .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
  cell.id = containerUniqueId;
  const cellTextUniqueId =
    "cell_text_" +
    name_content.innerHTML
      .replace(/ /g, "_")
      .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
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

// Start of skill filter functions
// Start of skill filter functions

// Checks all the available skills from the globalUserArray
function getAvailableItems(globalUserArray, itemKeyPrefix, itemCount) {
  const itemFrequencyMap = new Map();

  globalUserArray.forEach((user) => {
    for (let i = 1; i <= itemCount; i++) {
      const itemKey = `${itemKeyPrefix}${i}`;
      if (itemKey in user) {
        const item = user[itemKey];
        if (itemFrequencyMap.has(item)) {
          itemFrequencyMap.set(item, itemFrequencyMap.get(item) + 1);
        } else {
          itemFrequencyMap.set(item, 1);
        }
      }
    }
  });

  const availableItems = Array.from(itemFrequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  return availableItems;
}

// Checks what checkboxes are checked on the filterFormId
function getSelectedCategoryFilters(filterFormId) {
  let filters = [];
  const filterForm = document.getElementById(filterFormId);
  const checkboxes = filterForm.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      filters.push(checkboxes[i].value);
    }
  }
  return filters;
}

// Adds more checkboxes onto skillFilterFrom based on getAvailableSkills
function addItemFormGroup(item, container_id, callbackFunction) {
  const container = document.getElementById(container_id);
  /* Create elements */
  const form_group = document.createElement("div");
  form_group.className = "form-group";
  const form_check = document.createElement("div");
  form_check.className = "form-check";
  const input = document.createElement("input");
  input.className = "form-check-input";
  input.type = "checkbox";
  input.value = item;
  input.onchange = callbackFunction;
  const label = document.createElement("label");
  label.className = "form-check-label";
  label.textContent = item;
  /* Append all created elements */
  if (label.textContent != "N/A") {
    container.append(form_check);
    form_check.append(input, label);
  }
}

// Search function to only display checkboxes based on searched label
function filterSkills() {
  const searchInput = document.getElementById("skillSearch");
  const searchQuery = searchInput.value.toLowerCase();
  const skillFilterForm = document.getElementById("skillFilterForm");
  const labels = skillFilterForm.querySelectorAll("label");

  for (let label of labels) {
    if (label.textContent.toLowerCase().includes(searchQuery)) {
      label.parentElement.style.display = "block";
    } else {
      label.parentElement.style.display = "none";
    }
  }
}

// Updates skillFormGroup based on current available skills
function updateItemFilters(
  globalUserArray,
  itemKeyPrefix,
  itemCount,
  container_id,
  callbackFunction
) {
  const parentDiv = document.getElementById(container_id);
  let childDiv = parentDiv.querySelector("div");
  while (childDiv) {
    parentDiv.removeChild(childDiv);
    childDiv = parentDiv.querySelector("div");
  }
  availableItems = getAvailableItems(globalUserArray, itemKeyPrefix, itemCount);
  for (item in availableItems) {
    const itemName = availableItems[item];
    addItemFormGroup(itemName, container_id, callbackFunction);
  }
}

// Checks if user has selected skills based on checkboxes checked
function hasSelectedItems(
  globalUserArray,
  filters,
  userID,
  itemKeyPrefix,
  itemCount
) {
  for (let i = 0; i < filters.length; i++) {
    let filterFound = false;

    for (let j = 0; j < itemCount; j++) {
      const itemKey = `${itemKeyPrefix}${j + 1}`;

      if (globalUserArray[userID][itemKey] === filters[i]) {
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

// Removes users who doesn't meet criteria
function removeFilteredApplicants(
  globalUserArray,
  filterFormId,
  itemKeyPrefix,
  itemCount
) {
  let selectedApplicants = globalUserArray.slice();

  filters = getSelectedCategoryFilters(filterFormId);
  for (let i = 0; i < selectedApplicants.length; i++) {
    if (
      !hasSelectedItems(
        selectedApplicants,
        filters,
        i,
        itemKeyPrefix,
        itemCount
      )
    ) {
      let container_id =
        "#container_" +
        selectedApplicants[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      $(container_id).remove();
      selectedApplicants.splice(i, 1);
      i--;
    }
  }
  console.log(selectedApplicants);
  $("#selectedApplicants").html("");
  for (let i = 0; i < selectedApplicants.length; i++) {
    $("#selectedApplicants").append(selectedApplicants[i].name + "<br>");
  }
  return selectedApplicants;
}

function skillFilterCallback() {
  const parentDiv = document.getElementById("userContainers");
  let childDiv = parentDiv.querySelector("div");
  while (childDiv) {
    parentDiv.removeChild(childDiv);
    childDiv = parentDiv.querySelector("div");
  }
  if (globalUserArray.length == 0) {
    alert("Nothing to convert");
    event.preventDefault();
  } else {
    displayUserSummary();
  }
  getSelectedFilters("skillFilterForm");
  removeFilteredApplicants(globalUserArray, "skillFilterForm", "skill", 5);
}

function educationFilterCallback() {
  const parentDiv = document.getElementById("userContainers");
  let childDiv = parentDiv.querySelector("div");
  while (childDiv) {
    parentDiv.removeChild(childDiv);
    childDiv = parentDiv.querySelector("div");
  }
  if (globalUserArray.length == 0) {
    alert("Nothing to convert");
    event.preventDefault();
  } else {
    displayUserSummary();
  }
  getSelectedFilters("educationFilterForm");
  removeFilteredApplicants(
    globalUserArray,
    "educationFilterForm",
    "educationFullTitle",
    3
  );
}

function experienceFilterCallback() {
  const parentDiv = document.getElementById("userContainers");
  let childDiv = parentDiv.querySelector("div");
  while (childDiv) {
    parentDiv.removeChild(childDiv);
    childDiv = parentDiv.querySelector("div");
  }
  if (globalUserArray.length == 0) {
    alert("Nothing to convert");
    event.preventDefault();
  } else {
    displayUserSummary();
  }
  getSelectedFilters("experienceFilterForm");
  removeFilteredApplicants(
    globalUserArray,
    "experienceFilterForm",
    "jobExperienceTitle",
    5
  );
}

// End of skill filter functions
// End of skill filter functions

function displaySelectedFilter() {
  // Get the selected filter value
  let selectedFilter = document.getElementById("myDropdown").value;

  // Get the form elements
  let skillFilterForm =
    document.getElementById("skillFilterForm").parentNode.parentNode.parentNode;
  let educationFilterForm = document.getElementById("educationFilterForm")
    .parentNode.parentNode.parentNode;
  let experienceFilterForm = document.getElementById("experienceFilterForm")
    .parentNode.parentNode.parentNode;
  $("#skillFilterForm input[type='checkbox']").prop("checked", false);
  $("#educationFilterForm input[type='checkbox']").prop("checked", false);
  $("#experienceFilterForm input[type='checkbox']").prop("checked", false);

  // Set the display style of the form elements based on the selected filter
  skillFilterForm.style.display =
    selectedFilter === "option1" ? "flex" : "none";
  educationFilterForm.style.display =
    selectedFilter === "option2" ? "flex" : "none";
  experienceFilterForm.style.display =
    selectedFilter === "option3" ? "flex" : "none";
}

function retrieveSelectedApplicants() {
  let selectedFilter = document.getElementById("myDropdown").value;
  if (selectedFilter === "option1") {
    selectedApplicants = removeFilteredApplicants(
      globalUserArray,
      "skillFilterForm",
      "skill",
      5
    );
  }
  if (selectedFilter === "option2") {
    selectedApplicants = removeFilteredApplicants(
      globalUserArray,
      "educationFilterForm",
      "educationFullTitle",
      3
    );
  }
  if (selectedFilter === "option3") {
    selectedApplicants = removeFilteredApplicants(
      globalUserArray,
      "experienceFilterForm",
      "jobExperienceTitle",
      5
    );
  }
  return selectedApplicants;
}
