const globalUserArray = JSON.parse(localStorage.getItem("globalUserArray"));

function displayUserSummary() {
  const applicantSummaryContainer = document.getElementById(
    "applicantSummaryContainer"
  );

  for (let i = 0; i < globalUserArray.length; i++) {
    const user = globalUserArray[i];

    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    const div = document.createElement("div");
    div.className = "table-img";
    div.style.display = "flex"; // Add this line
    const a = document.createElement("a");
    const img = document.createElement("img");
    img.src = "../assets/img/profiles/4.png";
    img.alt = "profile";
    img.className = "img-table";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = user.name;

    div.appendChild(img); // Change this line
    div.appendChild(nameLabel); // Change this line
    tdName.appendChild(div); // Change this line

    const tdEducation = document.createElement("td");
    const educationLabel = document.createElement("label");
    educationLabel.textContent = user.highestEducation;
    tdEducation.appendChild(educationLabel);

    const tdJob = document.createElement("td");
    const jobLabel = document.createElement("label");
    jobLabel.textContent = user.jobExperienceTitle1;
    tdJob.appendChild(jobLabel);

    const tdSkill = document.createElement("td");
    const skillLabel = document.createElement("label");
    skillLabel.textContent = user.skill1;
    tdSkill.appendChild(skillLabel);

    const tdCertification = document.createElement("td");
    const certificationLabel = document.createElement("label");
    certificationLabel.textContent = user.certification1Title;
    tdCertification.appendChild(certificationLabel);

    const tdAccomplishment = document.createElement("td");
    const accomplishmentLabel = document.createElement("label");
    accomplishmentLabel.textContent = user.accomplishment1Title;
    tdAccomplishment.appendChild(accomplishmentLabel);

    tr.appendChild(tdName);
    tr.appendChild(tdEducation);
    tr.appendChild(tdJob);
    tr.appendChild(tdSkill);
    tr.appendChild(tdCertification);
    tr.appendChild(tdAccomplishment);

    applicantSummaryContainer.appendChild(tr);
  }
}
