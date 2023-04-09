const globalUserArray = JSON.parse(localStorage.getItem("selectedApplicants"));
var browsingMethod = JSON.parse(localStorage.getItem("browsingMethod"));
var apiKeyValue = JSON.parse(sessionStorage.getItem("apiKeyValue"));
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

function selectApplicant() {
  localStorage.setItem("finalApplicant", JSON.stringify(currentViewedUser));
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

async function askRank() {
  toggleSpinner();
  var rankings = [];
  if (browsingMethod == "Online") {
    if (globalUserArray.length <= 1) {
      let childId = $("#userContainers").children().first().attr("id");
      console.log("Only one applicant. No need to rank.");
      setOverlayOpacity(childId, 1, 1);
      return;
    }
    let textArray = [];
    let containertextIDArray = [];
    for (let i = 0; i < globalUserArray.length; i++) {
      let container_id =
        "#container_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      let currentText = "";
      currentText += checkValueRemoveNA(globalUserArray[i].name);
      currentText += checkValueRemoveNA(globalUserArray[i].educationFullTitle1);
      currentText += checkValueRemoveNA(
        globalUserArray[i].educationSchoolName1
      );
      currentText += checkValueRemoveNA(globalUserArray[i].educationYearEnded1);
      currentText += checkValueRemoveNA(globalUserArray[i].educationFullTitle2);
      currentText += checkValueRemoveNA(
        globalUserArray[i].educationSchoolName2
      );
      currentText += checkValueRemoveNA(globalUserArray[i].educationYearEnded2);
      currentText += checkValueRemoveNA(globalUserArray[i].educationFullTitle3);
      currentText += checkValueRemoveNA(
        globalUserArray[i].educationSchoolName3
      );
      currentText += checkValueRemoveNA(globalUserArray[i].educationYearEnded3);
      currentText += checkValueRemoveNA(globalUserArray[i].jobExperienceTitle1);
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceCompany1
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceYearEnded1
      );
      currentText += checkValueRemoveNA(globalUserArray[i].jobExperienceTitle2);
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceCompany2
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceYearEnded2
      );
      currentText += checkValueRemoveNA(globalUserArray[i].jobExperienceTitle3);
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceCompany3
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceYearEnded3
      );
      currentText += checkValueRemoveNA(globalUserArray[i].jobExperience4Title);
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceCompany4
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceYearEnded4
      );
      currentText += checkValueRemoveNA(globalUserArray[i].jobExperience5Title);
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceCompany5
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].jobExperienceYearEnded5
      );
      currentText += checkValueRemoveNA(globalUserArray[i].skill1);
      currentText += checkValueRemoveNA(globalUserArray[i].skill2);
      currentText += checkValueRemoveNA(globalUserArray[i].skill3);
      currentText += checkValueRemoveNA(globalUserArray[i].skill4);
      currentText += checkValueRemoveNA(globalUserArray[i].skill5);
      currentText += checkValueRemoveNA(globalUserArray[i].skill6);
      currentText += checkValueRemoveNA(globalUserArray[i].skill7);
      currentText += checkValueRemoveNA(globalUserArray[i].skill8);
      currentText += checkValueRemoveNA(globalUserArray[i].skill9);
      currentText += checkValueRemoveNA(globalUserArray[i].skill10);
      currentText += checkValueRemoveNA(globalUserArray[i].certification1Title);
      currentText += checkValueRemoveNA(globalUserArray[i].certification2Title);
      currentText += checkValueRemoveNA(globalUserArray[i].certification3Title);
      currentText += checkValueRemoveNA(globalUserArray[i].certification4Title);
      currentText += checkValueRemoveNA(globalUserArray[i].certification5Title);
      currentText += checkValueRemoveNA(
        globalUserArray[i].accomplishment1Title
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].accomplishment2Title
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].accomplishment3Title
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].accomplishment4Title
      );
      currentText += checkValueRemoveNA(
        globalUserArray[i].accomplishment5Title
      );
      containertextIDArray.push(container_id);
      textArray.push(currentText);
    }

    console.log(containertextIDArray);

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
...`;
    if (prompt.length < 10000) {
      console.log(prompt);
      response = await fetchAskRank(prompt);
      const lines = response.split("\n");

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
      /* for (var i = 0; i < rankings.length; i++) {
        var div = document.querySelector("#" + containertextIDArray[i]);
        // Append the text from array A to the innerHTML of the div
        div.innerHTML += rankings[i];
      } */
    } else {
      return "Too much to rank!";
    }
  }
  // Doesn't fetchAskRank if offline
  else {
    function generateRandomIntegers(length) {
      if (length === 1) {
        return [1];
      }
      const min = 1; // lowest number
      const max = length; // highest number
      const randomIntegers = [];

      while (randomIntegers.length < length) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        if (!randomIntegers.includes(randomNumber)) {
          randomIntegers.push(randomNumber);
        }
      }

      return randomIntegers;
    }

    rankings = generateRandomIntegers(globalUserArray.length);
  }

  const parentDivID = "userContainers";
  let containerIDArray = [];
  const userContainers = document.getElementById(parentDivID);
  Array.from(userContainers.children).forEach(function (child) {
    console.log(`container id found: ${child.id}`);
    containerIDArray.push(child.id);
  });
  console.log(`Container ID Array: ${containerIDArray}`);
  console.log(`Rankings: ${rankings}`);
  rearrangeContainers(containerIDArray, rankings);
  const maxRank = Math.max(...rankings);
  for (let i = 0; i < containerIDArray.length; i++) {
    const container = document.getElementById(containerIDArray[i]);
    setOverlayOpacity(container.id, rankings[i], maxRank);
  }
  toggleSpinner();
}
function rearrangeContainers(containerIDArray, rankings) {
  const containers = []; // temporary array to store the container elements
  const userContainers = document.querySelector("#userContainers");

  // push the container elements into the temporary array in their current order
  for (let i = 0; i < containerIDArray.length; i++) {
    const container = document.querySelector(`#${containerIDArray[i]}`);
    containers.push(container);
  }

  // sort the temporary array based on the rankings
  containers.sort(
    (a, b) =>
      rankings[containerIDArray.indexOf(a.id)] -
      rankings[containerIDArray.indexOf(b.id)]
  );

  // remove the container elements from the userContainers element and re-append them in the new order
  containers.forEach((container) => {
    userContainers.removeChild(container);
    userContainers.appendChild(container);
  });
}

function setOverlayOpacity(elementId, rank, maxRank) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  let overlay = element.querySelector(".dark-overlay"); // Declare the 'overlay' variable here

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("dark-overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "opacity 0.3s";
    const borderRadius = window.getComputedStyle(element).borderRadius;
    if (borderRadius) {
      overlay.style.borderRadius = borderRadius;
    }
    element.style.position = "relative";
    element.appendChild(overlay);
  }

  let opacity;
  if (rank === 1) {
    opacity = 0; // set opacity to 1 for the element with the highest rank
    overlay.style.boxShadow =
      "0 0 5px rgba(113, 73, 198, 0.2), 0 0 10px rgba(113, 73, 198, 0.2), 0 0 15px rgba(113, 73, 198, 0.2), 0 0 20px rgba(113, 73, 198, 0.2), 0 0 35px rgba(113, 73, 198, 0.2), 0 0 40px rgba(113, 73, 198, 0.2), 0 0 50px rgba(113, 73, 198, 0.2)";
  } else {
    opacity = rank / 2 / maxRank; // calculate opacity for other elements
  }

  overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
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

toggleGlowOverlay("rankDiv");

function toggleGlowOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".glow-overlay");

  if (existingOverlay) {
    element.removeChild(existingOverlay);
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("glow-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "-1";

  overlay.style.boxShadow =
    "0 0 5px rgba(113, 73, 198, 0.2), 0 0 10px rgba(113, 73, 198, 0.2), 0 0 15px rgba(113, 73, 198, 0.2), 0 0 20px rgba(113, 73, 198, 0.2), 0 0 35px rgba(113, 73, 198, 0.2), 0 0 40px rgba(113, 73, 198, 0.2), 0 0 50px rgba(113, 73, 198, 0.2)";

  const borderRadius = window.getComputedStyle(element).borderRadius;
  if (borderRadius) {
    overlay.style.borderRadius = borderRadius;
  }

  element.style.position = "relative";
  element.appendChild(overlay);
}

async function initializeApiKey(apiKey) {
  try {
    const response = await fetch("/initialize-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API key initialized successfully:", data);
  } catch (error) {
    console.error("Error initializing API key:", error);
  }
}

initializeApiKey(apiKeyValue);

let spinnerVisible = false;
let overlayVisible = false;
function toggleSpinner() {
  const spinner = document.getElementById("spinner");
  const body = document.getElementsByTagName("html")[0];

  if (!spinnerVisible) {
    spinner.style.display = "inline-block";
    body.classList.add("disable-pointer-events");
    spinner.style.float = "left";
    spinnerVisible = true;
  } else {
    spinner.style.display = "none";
    body.classList.remove("disable-pointer-events");
    spinnerVisible = false;
  }
  const overlay = document.getElementById("overlay");
  overlayVisible = !overlayVisible;

  if (overlayVisible) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}
