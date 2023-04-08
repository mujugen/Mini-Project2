const globalUserArray = JSON.parse(
  localStorage.getItem("globalUserArrayPostRedFlag")
);

displaySelectedFilter();
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
retrieveSelectedApplicants();

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
  // Copies the contents of globalUserArray
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
  console.log("Skill Filter Callback");
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
    for (let i = 0; i < globalUserArray.length; i++) {
      createUserCard(i);
    }
  }
  getSelectedCategoryFilters("skillFilterForm");
  removeFilteredApplicants(globalUserArray, "skillFilterForm", "skill", 5);
}

function educationFilterCallback() {
  console.log("Education Filter Callback");
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
    for (let i = 0; i < globalUserArray.length; i++) {
      createUserCard(i);
    }
  }
  getSelectedCategoryFilters("educationFilterForm");
  removeFilteredApplicants(
    globalUserArray,
    "educationFilterForm",
    "educationFullTitle",
    3
  );
}

function experienceFilterCallback() {
  console.log("Skill Filter Callback");
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
    for (let i = 0; i < globalUserArray.length; i++) {
      createUserCard(i);
    }
  }
  getSelectedCategoryFilters("experienceFilterForm");
  removeFilteredApplicants(
    globalUserArray,
    "experienceFilterForm",
    "jobExperienceTitle",
    5
  );
}

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
  selectedApplicants = retrieveSelectedApplicants();
  if (selectedApplicants.length == 0) {
    alert("Nothing to finalize");
    event.preventDefault();
  } else {
    localStorage.setItem(
      "selectedApplicants",
      JSON.stringify(selectedApplicants)
    );
    window.location.href = "applicant-ranking.html";
  }
}

toggleGlowOverlay("finalizeCard");
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
