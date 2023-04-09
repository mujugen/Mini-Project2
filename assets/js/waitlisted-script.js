const globalUserArray = JSON.parse(
  localStorage.getItem("unselectedApplicants")
);

function selectApplicant() {
  localStorage.setItem("finalApplicant", JSON.stringify(currentViewedUser));
  window.location.href = "final-applicant.html";
}

var unviewedUsers = [...globalUserArray];

function selectApplicant() {
  localStorage.setItem("finalApplicant", JSON.stringify(currentViewedUser));
  localStorage.setItem("shortListedApplicants", JSON.stringify(unviewedUsers));
  window.location.href = "final-applicant.html";
}

for (let i = 0; i < globalUserArray.length; i++) {
  createUserCard(i);
}

var currentViewedUser;
function createUserCard(i) {
  const user = globalUserArray[i];

  // Create a unique id for the container
  const containerUniqueId =
    "container_" +
    user.name
      .replace(/ /g, "_")
      .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");

  // Create the card elements
  const card = document.createElement("div");
  card.classList.add(
    "card",
    "card-lists",
    "flex-fill",
    "applicant-card",
    "hover-shadow"
  );
  card.id = containerUniqueId;
  card.style.cursor = "pointer"; // Make the cursor a pointer when hovering over the row
  card.addEventListener("click", () => {
    const index = retrieveIDfromName(user.name);
    putApplicantInfoInEAC(index);
    toggleExpandedApplicantContainer();
    currentViewedUser = user;
    removeUserFromUnviewed(user);
  });

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

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

  img.alt = "Applicant Image";
  img.classList.add("rounded-image");
  img.width = "100";

  const h2 = document.createElement("h2");
  h2.classList.add("card-titles");
  const nameLink = document.createElement("a");
  nameLink.id = "name";
  nameLink.innerText = user.name;
  h2.appendChild(nameLink);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const memberInfo = document.createElement("div");
  memberInfo.classList.add("member-info");

  const listItems = [
    ["Education", "educationFullTitle1"],
    ["Experience", "jobExperienceTitle1"],
    ["Experience", "jobExperienceTitle2"],
    ["Skills", "skill1", "skill2", "skill3"],
    ["Certifications", "certification1Title"],
    ["Accomplishments", "accomplishment1Title"],
  ];

  const ul = document.createElement("ul");

  listItems.forEach((item) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.style.marginRight = "20%";
    label.innerText = item[0];
    li.appendChild(label);
    if (item[0] === "Skills") {
      const skills = document.createElement("span");
      skills.id = "skills";
      skills.innerText = `${user[item[1]]}, ${user[item[2]]}, ${user[item[3]]}`;
      li.appendChild(skills);
    } else {
      item.slice(1).forEach((key) => {
        const span = document.createElement("span");
        span.id = key;
        span.innerHTML = user[key] || "";
        span.style.display = "inline-block";
        span.style.verticalAlign = "top";
        span.style.textAlign = "right";
        li.appendChild(span);
      });
    }

    ul.appendChild(li);
  });

  memberInfo.appendChild(ul);
  cardBody.appendChild(memberInfo);
  cardHeader.appendChild(img);
  cardHeader.appendChild(h2);
  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  // Append the card to the userContainers div
  const userContainers = document.querySelector("#userContainers");
  userContainers.appendChild(card);
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
  for (let i = 0; i < globalUserArray.length; i++) {
    if (globalUserArray[i].name == name) {
      return i;
    }
  }
  return "Failed to find";
}

function putApplicantInfoInEAC(i) {
  $("#EACName").html(checkValue(globalUserArray[i].name));
  $("#EACEducationTitle1").html(
    checkValue(globalUserArray[i].educationFullTitle1)
  );
  $("#EACEducationSchool1").html(
    checkValue(globalUserArray[i].educationSchoolName1)
  );
  $("#EACEducationYear1").html(
    checkValue(globalUserArray[i].educationYearEnded1)
  );
  $("#EACEducationTitle2").html(
    checkValue(globalUserArray[i].educationFullTitle2)
  );
  $("#EACEducationSchool2").html(
    checkValue(globalUserArray[i].educationSchoolName2)
  );
  $("#EACEducationYear2").html(
    checkValue(globalUserArray[i].educationYearEnded2)
  );
  $("#EACEducationTitle3").html(
    checkValue(globalUserArray[i].educationFullTitle3)
  );
  $("#EACEducationSchool3").html(
    checkValue(globalUserArray[i].educationSchoolName3)
  );
  $("#EACEducationYear3").html(
    checkValue(globalUserArray[i].educationYearEnded3)
  );
  $("#EACJobTitle1").html(checkValue(globalUserArray[i].jobExperienceTitle1));
  $("#EACJobCompany1").html(
    checkValue(globalUserArray[i].jobExperienceCompany1)
  );
  $("#EACJobYear1").html(
    checkValue(globalUserArray[i].jobExperienceYearEnded1)
  );
  $("#EACJobTitle2").html(checkValue(globalUserArray[i].jobExperienceTitle2));
  $("#EACJobCompany2").html(
    checkValue(globalUserArray[i].jobExperienceCompany2)
  );
  $("#EACJobYear2").html(
    checkValue(globalUserArray[i].jobExperienceYearEnded2)
  );
  $("#EACJobTitle3").html(checkValue(globalUserArray[i].jobExperienceTitle3));
  $("#EACJobCompany3").html(
    checkValue(globalUserArray[i].jobExperienceCompany3)
  );
  $("#EACJobYear3").html(
    checkValue(globalUserArray[i].jobExperienceYearEnded3)
  );
  $("#EACJobTitle4").html(checkValue(globalUserArray[i].jobExperience4Title));
  $("#EACJobCompany4").html(
    checkValue(globalUserArray[i].jobExperienceCompany4)
  );
  $("#EACJobYear4").html(
    checkValue(globalUserArray[i].jobExperienceYearEnded4)
  );
  $("#EACJobTitle5").html(checkValue(globalUserArray[i].jobExperience5Title));
  $("#EACJobCompany5").html(
    checkValue(globalUserArray[i].jobExperienceCompany5)
  );
  $("#EACJobYear5").html(
    checkValue(globalUserArray[i].jobExperienceYearEnded5)
  );
  $("#EACSkill1").html(checkValue(globalUserArray[i].skill1));
  $("#EACSkill2").html(checkValue(globalUserArray[i].skill2));
  $("#EACSkill3").html(checkValue(globalUserArray[i].skill3));
  $("#EACSkill4").html(checkValue(globalUserArray[i].skill4));
  $("#EACSkill5").html(checkValue(globalUserArray[i].skill5));
  $("#EACSkill6").html(checkValue(globalUserArray[i].skill6));
  $("#EACSkill7").html(checkValue(globalUserArray[i].skill7));
  $("#EACSkill8").html(checkValue(globalUserArray[i].skill8));
  $("#EACSkill9").html(checkValue(globalUserArray[i].skill9));
  $("#EACSkill10").html(checkValue(globalUserArray[i].skill10));
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
    checkValue(globalUserArray[i].certification1Title)
  );
  $("#EACCertification2").html(
    checkValue(globalUserArray[i].certification2Title)
  );
  $("#EACCertification3").html(
    checkValue(globalUserArray[i].certification3Title)
  );
  $("#EACCertification4").html(
    checkValue(globalUserArray[i].certification4Title)
  );
  $("#EACCertification5").html(
    checkValue(globalUserArray[i].certification5Title)
  );
  $("#EACAccomplishment1").html(
    checkValue(globalUserArray[i].accomplishment1Title)
  );
  $("#EACAccomplishment2").html(
    checkValue(globalUserArray[i].accomplishment2Title)
  );
  $("#EACAccomplishment3").html(
    checkValue(globalUserArray[i].accomplishment3Title)
  );
  $("#EACAccomplishment4").html(
    checkValue(globalUserArray[i].accomplishment4Title)
  );
  $("#EACAccomplishment5").html(
    checkValue(globalUserArray[i].accomplishment5Title)
  );
}

function checkValue(value) {
  if (value === "N/A" || value === "None") {
    return "";
  }
  return value + "</br>";
}
function checkValueRemoveNA(value) {
  if (value === "N/A" || value === "None") {
    return "";
  }
  return value + " ";
}

