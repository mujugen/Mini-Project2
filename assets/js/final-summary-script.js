var finalApplicant = Array.from([
  JSON.parse(localStorage.getItem("finalApplicant")),
]);
var userDetails = Array.from([JSON.parse(localStorage.getItem("userDetails"))]);
finalApplicant[0]["date"] = userDetails[0]["date"];
finalApplicant[0]["time"] = userDetails[0]["time"];
var finalApplicantArray =
  JSON.parse(localStorage.getItem("finalApplicantArray")) || [];

if (finalApplicant.length > 0) {
  // Check if finalApplicantArray already contains finalApplicant[0].name
  const existingApplicant = finalApplicantArray.find(
    (applicant) => applicant.name === finalApplicant[0].name
  );

  if (!existingApplicant) {
    // If the applicant doesn't exist in the array, add it to the end
    finalApplicantArray.push(finalApplicant[0]);
    localStorage.setItem(
      "finalApplicantArray",
      JSON.stringify(finalApplicantArray)
    );
  }
}

function displayUserSummary() {
  const applicantSummaryContainer = document.getElementById(
    "applicantSummaryContainer"
  );

  for (let i = 0; i < finalApplicantArray.length; i++) {
    const user = finalApplicantArray[i];

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
    function getRandomImage() {
      const images = [
        "4.png",
        "5.png",
        "admin-img.png",
        "male-1.png",
        "male-2.png",
      ];

      const randomIndex = Math.floor(Math.random() * images.length);
      return "../assets/img/profiles/" + images[randomIndex];
    }

    img.src = getRandomImage();

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

    const tdDate = document.createElement("td");
    const DateLabel = document.createElement("label");
    DateLabel.textContent = user.date;
    tdDate.appendChild(DateLabel);

    const tdTime = document.createElement("td");
    const TimeLabel = document.createElement("label");
    TimeLabel.textContent = user.time;
    tdTime.appendChild(TimeLabel);

    tr.appendChild(tdName);
    tr.appendChild(tdEducation);
    tr.appendChild(tdJob);
    tr.appendChild(tdSkill);
    tr.appendChild(tdDate);
    tr.appendChild(tdTime);

    applicantSummaryContainer.appendChild(tr);
  }
}

function toggleExpandedApplicantContainer() {
  const container = document.getElementById("expandedApplicantContainer");
  const overlay = document.getElementById("overlayExpanded");

  // If the overlay doesn't exist, create it
  if (!overlay) {
    const newOverlay = document.createElement("div");
    newOverlay.id = "overlayExpanded";
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
    document.getElementById("overlayExpanded").style.display = "block";
    document.body.style.overflow = "hidden";
  } else {
    container.style.display = "none";
    document.getElementById("overlayExpanded").style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function retrieveIDfromName(name) {
  for (let i = 0; i < finalApplicantArray.length; i++) {
    if (finalApplicantArray[i].name == name) {
      return i;
    }
  }
  return "Failed to find";
}

function putApplicantInfoInEAC(i) {
  function checkValue(value) {
    if (value === "N/A" || value === "None") {
      return "";
    }
    return value + "</br>";
  }
  $("#EACName").html(checkValue(finalApplicantArray[i].name));
  $("#EACEducationTitle1").html(
    checkValue(finalApplicantArray[i].educationFullTitle1)
  );
  $("#EACEducationSchool1").html(
    checkValue(finalApplicantArray[i].educationSchoolName1)
  );
  $("#EACEducationYear1").html(
    checkValue(finalApplicantArray[i].educationYearEnded1)
  );
  $("#EACEducationTitle2").html(
    checkValue(finalApplicantArray[i].educationFullTitle2)
  );
  $("#EACEducationSchool2").html(
    checkValue(finalApplicantArray[i].educationSchoolName2)
  );
  $("#EACEducationYear2").html(
    checkValue(finalApplicantArray[i].educationYearEnded2)
  );
  $("#EACEducationTitle3").html(
    checkValue(finalApplicantArray[i].educationFullTitle3)
  );
  $("#EACEducationSchool3").html(
    checkValue(finalApplicantArray[i].educationSchoolName3)
  );
  $("#EACEducationYear3").html(
    checkValue(finalApplicantArray[i].educationYearEnded3)
  );
  $("#EACJobTitle1").html(
    checkValue(finalApplicantArray[i].jobExperienceTitle1)
  );
  $("#EACJobCompany1").html(
    checkValue(finalApplicantArray[i].jobExperienceCompany1)
  );
  $("#EACJobYear1").html(
    checkValue(finalApplicantArray[i].jobExperienceYearEnded1)
  );
  $("#EACJobTitle2").html(
    checkValue(finalApplicantArray[i].jobExperienceTitle2)
  );
  $("#EACJobCompany2").html(
    checkValue(finalApplicantArray[i].jobExperienceCompany2)
  );
  $("#EACJobYear2").html(
    checkValue(finalApplicantArray[i].jobExperienceYearEnded2)
  );
  $("#EACJobTitle3").html(
    checkValue(finalApplicantArray[i].jobExperienceTitle3)
  );
  $("#EACJobCompany3").html(
    checkValue(finalApplicantArray[i].jobExperienceCompany3)
  );
  $("#EACJobYear3").html(
    checkValue(finalApplicantArray[i].jobExperienceYearEnded3)
  );
  $("#EACJobTitle4").html(
    checkValue(finalApplicantArray[i].jobExperience4Title)
  );
  $("#EACJobCompany4").html(
    checkValue(finalApplicantArray[i].jobExperienceCompany4)
  );
  $("#EACJobYear4").html(
    checkValue(finalApplicantArray[i].jobExperienceYearEnded4)
  );
  $("#EACJobTitle5").html(
    checkValue(finalApplicantArray[i].jobExperience5Title)
  );
  $("#EACJobCompany5").html(
    checkValue(finalApplicantArray[i].jobExperienceCompany5)
  );
  $("#EACJobYear5").html(
    checkValue(finalApplicantArray[i].jobExperienceYearEnded5)
  );
  $("#EACSkill1").html(checkValue(finalApplicantArray[i].skill1));
  $("#EACSkill2").html(checkValue(finalApplicantArray[i].skill2));
  $("#EACSkill3").html(checkValue(finalApplicantArray[i].skill3));
  $("#EACSkill4").html(checkValue(finalApplicantArray[i].skill4));
  $("#EACSkill5").html(checkValue(finalApplicantArray[i].skill5));
  $("#EACSkill6").html(checkValue(finalApplicantArray[i].skill6));
  $("#EACSkill7").html(checkValue(finalApplicantArray[i].skill7));
  $("#EACSkill8").html(checkValue(finalApplicantArray[i].skill8));
  $("#EACSkill9").html(checkValue(finalApplicantArray[i].skill9));
  $("#EACSkill10").html(checkValue(finalApplicantArray[i].skill10));
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

  $("#EACCertification1").html(
    checkValue(finalApplicantArray[i].certification1Title)
  );
  $("#EACCertification2").html(
    checkValue(finalApplicantArray[i].certification2Title)
  );
  $("#EACCertification3").html(
    checkValue(finalApplicantArray[i].certification3Title)
  );
  $("#EACCertification4").html(
    checkValue(finalApplicantArray[i].certification4Title)
  );
  $("#EACCertification5").html(
    checkValue(finalApplicantArray[i].certification5Title)
  );
  $("#EACAccomplishment1").html(
    checkValue(finalApplicantArray[i].accomplishment1Title)
  );
  $("#EACAccomplishment2").html(
    checkValue(finalApplicantArray[i].accomplishment2Title)
  );
  $("#EACAccomplishment3").html(
    checkValue(finalApplicantArray[i].accomplishment3Title)
  );
  $("#EACAccomplishment4").html(
    checkValue(finalApplicantArray[i].accomplishment4Title)
  );
  $("#EACAccomplishment5").html(
    checkValue(finalApplicantArray[i].accomplishment5Title)
  );
}

displayUserSummary();

localStorage.setItem("calendarPrevPage", JSON.stringify("final-summary.html"));
