const globalUserArray = JSON.parse(localStorage.getItem("globalUserArray"));

function displayUserSummary() {
  const applicantSummaryContainer = document.getElementById(
    "applicantSummaryContainer"
  );

  for (let i = 0; i < globalUserArray.length; i++) {
    const user = globalUserArray[i];

    const tr = document.createElement("tr");
    tr.style.cursor = "pointer"; // Make the cursor a pointer when hovering over the row

    // Add a click event listener to the tr element
    tr.addEventListener("click", () => {
      const index = retrieveIDfromName(user.name);
      putApplicantInfoInEAC(index);
      toggleExpandedApplicantContainer();
    });

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

function toggleExpandedApplicantContainer() {
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
    newOverlay.addEventListener("click", toggleExpandedApplicantContainer);
    document.body.appendChild(newOverlay);
  }

  if (container.style.display === "none" || !container.style.display) {
    container.style.display = "block";
    container.style.position = "fixed";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.transform = "translate(-50%, -50%)";
    container.style.zIndex = "1001";
    container.style.maxHeight = "80vh";
    container.style.overflowY = "auto";
    container.style.boxSizing = "border-box";
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    container.style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function retrieveIDfromName(name) {
  for (let i = 0; i < globalUserArray.length; i++) {
    if (globalUserArray[i].name == name) {
      return i;
    }
  }
  return "Failed to find";
}

function putApplicantInfoInEAC(i) {
  $("#EACName").html(globalUserArray[i].name);
  $("#EACEducationTitle1").html(globalUserArray[i].educationFullTitle1);
  $("#EACEducationSchool1").html(globalUserArray[i].educationSchoolName1);
  $("#EACEducationYear1").html(globalUserArray[i].educationYearEnded1);
  $("#EACEducationTitle2").html(globalUserArray[i].educationFullTitle2);
  $("#EACEducationSchool2").html(globalUserArray[i].educationSchoolName2);
  $("#EACEducationYear2").html(globalUserArray[i].educationYearEnded2);
  $("#EACEducationTitle3").html(globalUserArray[i].educationFullTitle3);
  $("#EACEducationSchool3").html(globalUserArray[i].educationSchoolName3);
  $("#EACEducationYear3").html(globalUserArray[i].educationYearEnded3);
  $("#EACJobTitle1").html(globalUserArray[i].jobExperienceTitle1);
  $("#EACJobCompany1").html(globalUserArray[i].jobExperienceCompany1);
  $("#EACJobYear1").html(globalUserArray[i].jobExperienceYearEnded1);
  $("#EACJobTitle2").html(globalUserArray[i].jobExperienceTitle2);
  $("#EACJobCompany2").html(globalUserArray[i].jobExperienceCompany2);
  $("#EACJobYear2").html(globalUserArray[i].jobExperienceYearEnded2);
  $("#EACJobTitle3").html(globalUserArray[i].jobExperienceTitle3);
  $("#EACJobCompany3").html(globalUserArray[i].jobExperienceCompany3);
  $("#EACJobYear3").html(globalUserArray[i].jobExperienceYearEnded3);
  $("#EACJobTitle4").html(globalUserArray[i].jobExperience4Title);
  $("#EACJobCompany4").html(globalUserArray[i].jobExperienceCompany4);
  $("#EACJobYear4").html(globalUserArray[i].jobExperienceYearEnded4);
  $("#EACJobTitle5").html(globalUserArray[i].jobExperience5Title);
  $("#EACJobCompany5").html(globalUserArray[i].jobExperienceCompany5);
  $("#EACJobYear5").html(globalUserArray[i].jobExperienceYearEnded5);
  $("#EACSkill1").html(globalUserArray[i].skill1);
  $("#EACSkill2").html(globalUserArray[i].skill2);
  $("#EACSkill3").html(globalUserArray[i].skill3);
  $("#EACSkill4").html(globalUserArray[i].skill4);
  $("#EACSkill5").html(globalUserArray[i].skill5);
  $("#EACSkill6").html(globalUserArray[i].skill6);
  $("#EACSkill7").html(globalUserArray[i].skill7);
  $("#EACSkill8").html(globalUserArray[i].skill8);
  $("#EACSkill9").html(globalUserArray[i].skill9);
  $("#EACSkill10").html(globalUserArray[i].skill10);
  $("#EACSkill1").parent().css("display", "inline");
  $("#EACSkill2").parent().css("display", "inline");
  $("#EACSkill3").parent().css("display", "inline");
  $("#EACSkill4").parent().css("display", "inline");
  $("#EACSkill5").parent().css("display", "inline");
  $("#EACSkill6").parent().css("display", "inline");
  $("#EACSkill7").parent().css("display", "inline");
  $("#EACSkill8").parent().css("display", "inline");
  $("#EACSkill9").parent().css("display", "inline");
  $("#EACSkill10").parent().css("display", "inline");

  $("#EACSkill1").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill2").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill3").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill4").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill5").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill6").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill7").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill8").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill9").css({
    "font-size": "20px",
    margin: "4px",
  });
  $("#EACSkill10").css({
    "font-size": "20px",
    margin: "4px",
  });

  $("#EACCertification1").html(globalUserArray[i].certification1Title);
  $("#EACCertification2").html(globalUserArray[i].certification2Title);
  $("#EACCertification3").html(globalUserArray[i].certification3Title);
  $("#EACCertification4").html(globalUserArray[i].certification4Title);
  $("#EACCertification5").html(globalUserArray[i].certification5Title);
  $("#EACAccomplishment1").html(globalUserArray[i].accomplishment1Title);
  $("#EACAccomplishment2").html(globalUserArray[i].accomplishment2Title);
  $("#EACAccomplishment3").html(globalUserArray[i].accomplishment3Title);
  $("#EACAccomplishment4").html(globalUserArray[i].accomplishment4Title);
  $("#EACAccomplishment5").html(globalUserArray[i].accomplishment5Title);
}
