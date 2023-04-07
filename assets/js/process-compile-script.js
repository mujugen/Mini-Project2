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

function toggleApplicantContainer() {
  const container = document.getElementById("expandedApplicantContainer");
  const overlay = document.getElementById("overlay");

  // If the overlay doesn't exist, create it
  if (!overlay) {
    const newOverlay = document.createElement("div");
    newOverlay.id = "overlay";
    newOverlay.style.position = "fixed";
    newOverlay.style.top = "0";
    newOverlay.style.left = "0";
    newOverlay.style.width = "100%";
    newOverlay.style.height = "100%";
    newOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    newOverlay.style.display = "none";
    newOverlay.style.zIndex = "1000";
    newOverlay.addEventListener("click", toggleApplicantContainer);
    document.body.appendChild(newOverlay);
  }

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "1001";
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    container.style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
  }
}
