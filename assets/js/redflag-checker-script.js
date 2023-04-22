const globalUserArray = JSON.parse(localStorage.getItem("globalUserArray"));

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
  console.log("Running fetchredFlagRemover");
  const response = await fetch("/redFlagRemover", {
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
var browsingMethod = JSON.parse(localStorage.getItem("browsingMethod"));
var apiKeyValue = JSON.parse(sessionStorage.getItem("apiKeyValue"));
// Identifies which cards has a red flag and marks them red
async function runRedFlag() {
  toggleSpinner();
  filters = getSelectedFilters();
  if (filters.length != 0) {
    for (let i = 0; i < globalUserArray.length; i++) {
      let redFlags;
      if (globalUserArray[i].red_flag_1 == null) {
        console.log(
          `User ${globalUserArray[i].name} doesn't have red flags in DB`
        );
        if (browsingMethod == "Online") {
          redFlags = await fetchredFlagRemover(
            globalUserArray[i].raw_text,
            filters,
            globalUserArray[i].name
          );
        } else {
          console.log("Browsing in offline mode, making fake red flags");
          redFlags = {
            red_flag_1: 0,
            red_flag_2: 0,
            red_flag_3: 0,
            red_flag_4: 0,
            red_flag_5: 0,
            red_flag_6: 0,
            red_flag_7: 0,
            red_flag_8: 0,
          };
        }
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
        "#container_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      hasRedFlags = false;
      // Loop through redFlags object and check for values equal to 1
      for (let flag in redFlags) {
        let flagNumber = flag.split("_")[2];
        if (redFlags[flag] == 1 && filters.includes(flagNumber)) {
          const cardDiv = document.querySelector(container_id);
          const children = cardDiv.children;
          hasRedFlags = true;
          for (let i = 0; i < 2; i++) {
            children[i].classList.add("red");
          }
          hasRedFlags = true;
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
      // Makes the card red and adds the text if it has red flags
      if (hasRedFlags) {
        const container = document.querySelector(container_id + " ul");
        const newListItem = document.createElement("li");
        const newListItemLabel = document.createElement("label");
        newListItemLabel.innerHTML = "RED FLAGS:";

        const newListSpan = document.createElement("span");
        newListSpan.innerHTML = redFlag_content.textContent;

        newListItem.appendChild(newListItemLabel);
        newListItem.appendChild(newListSpan);
        container.appendChild(newListItem);
        const parent_container = $("#userContainers");
        const divToMove = $(container_id);
        if (divToMove.length && parent_container.has(divToMove).length) {
          divToMove.prependTo(parent_container);
        }
      }
    }
    toggleSpinner();
    toggleDarkOverlay("removeCard");
    toggleGlowOverlay("removeCard");
    toggleGlowOverlay("displayCard");
  } else {
    alert("No filters selected");
    toggleSpinner();
    toggleDarkOverlay("removeCard");
    toggleGlowOverlay("removeCard");
    toggleGlowOverlay("displayCard");
  }
}

// Connected to Remove Red Flags section button
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
    }
  }
}

for (let i = 0; i < globalUserArray.length; i++) {
  createUserCard(i);
}

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
  function checkValue(value) {
    if (value === "N/A" || value === "None") {
      return "";
    }
    return value + "</br>";
  }
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

function moveToFilterAndFinalizePage() {
  if (globalUserArray.length == 0) {
    alert("Nothing to pass");
    event.preventDefault();
  } else {
    localStorage.setItem(
      "globalUserArrayPostRedFlag",
      JSON.stringify(globalUserArray)
    );
    window.location.href = "filter-finalize.html";
  }
}

function toggleDarkOverlay(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const existingOverlay = element.querySelector(".dark-overlay");

  if (existingOverlay) {
    existingOverlay.style.opacity = "0";
    setTimeout(() => {
      element.removeChild(existingOverlay);
      element.style.pointerEvents = "auto";
    }, 300);
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("dark-overlay");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "102%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s";

  element.style.position = "relative";
  element.style.pointerEvents = "none";
  element.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = "1";
  }, 10);
}

toggleDarkOverlay("removeCard");
toggleDarkOverlay("proceedCard");
toggleGlowOverlay("displayCard");

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
