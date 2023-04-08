const globalUserArray = JSON.parse(localStorage.getItem("selectedApplicants"));

// Ranks all selected applicants
$("#rankBtn").on("click", function () {
  console.log("Rank button clicked");
  if (globalUserArray.length == 0) {
    alert("Nothing to to rank");
    event.preventDefault();
  } else {
    askRank();
  }
});

function selectApplicant(user) {
  localStorage.setItem("finalApplicant", JSON.stringify(user));
  window.location.href = "finalreview.html";
}

// Displays all selected applicants
displayUserSummary();
// Retrieves users array from DB
async function displayUserSummary() {
  let userArray = globalUserArray;
  // Create an HTML container for the raw text
  for (i = 0; i < userArray.length; i++) {
    container_id = "userContainers";
    addCardApplicant(container_id, userArray[i]);
  }
}

/* Function to create reproducable cells */
function addCardApplicant(container_id, user) {
  /* Initialize where to put elements */
  const container = document.getElementById(container_id);
  /* Create elements */
  const cell = document.createElement("div");
  const cell_text = document.createElement("div");
  const selectBtn = document.createElement("button");
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
  selectBtn.innerHTML = "Select";
  selectBtn.className = "btn btn-primary btn-block mt-2";
  selectBtn.onclick = () => selectApplicant(user);
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
  cell.append(img, cell_text, selectBtn);
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

async function askRank() {
  let textArray = [];
  let containertextIDArray = [];
  $("#userContainers .cell-text-container").each(function () {
    let currentText = $(this).text();
    containertextIDArray.push($(this).attr("id"));
    textArray.push(currentText);
  });

  prompt = ``;
  for (let i = 0; i < textArray.length; i++) {
    prompt += `Applicant ${i + 1}:\n`;
    prompt += textArray[i];
    prompt += `\n`;
  }
  prompt += `rank these applicants by how impressive their traits are(don't include any other text except the expected ouput),\n`;
  prompt += `expected output:
Applicant 1 Ranking: NUMBER
Applicant 2 Ranking: NUMBER
Applicant 3 Ranking: NUMBER
...`;
  if (prompt.length < 10000) {
    response = await fetchAskRank(prompt);
    const lines = response.split("\n");
    const rankings = [];
    lines.forEach((line) => {
      // Split the line by spaces and extract the ranking value
      const words = line.split(" ");
      const ranking = parseInt(words[words.length - 1]);

      // Get the applicant index (subtracting 1 to make it zero-based)
      const applicantIndex = parseInt(words[1]) - 1;

      // Store the ranking at the corresponding index in the array
      rankings[applicantIndex] = ranking;
    });
    console.log(rankings);
    for (var i = 0; i < rankings.length; i++) {
      var div = document.querySelector("#" + containertextIDArray[i]);
      // Append the text from array A to the innerHTML of the div
      div.innerHTML += rankings[i];
    }
  } else {
    return "Too much to rank!";
  }
  /* rankings = [3, 2, 1, 4, 5, 6, 7]; */

  const parentDivID = "userContainers";
  let containerIDArray = [];
  $("#userContainers")
    .children()
    .each(function () {
      containerIDArray.push($(this).attr("id"));
    });

  rearrangeChildren(parentDivID, rankings, containerIDArray);
}

function rearrangeChildren(parentDivID, rankings, containerIDArray) {
  const parentDiv = document.getElementById(parentDivID);
  const reorderedChildren = new Array(containerIDArray.length);
  for (let i = 0; i < rankings.length; i++) {
    const newIndex = rankings[i] - 1;
    const containerID = containerIDArray[newIndex];
    const container = document.getElementById(containerID);
    reorderedChildren[i] = container;
  }
  while (parentDiv.firstChild) {
    parentDiv.removeChild(parentDiv.firstChild);
  }
  for (let child of reorderedChildren) {
    parentDiv.appendChild(child);
  }
}
// Call CVSummarize API endpoint
async function fetchAskRank(prompt) {
  const response = await fetch("/askrank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const applicant = await response.json();
  return applicant;
}
