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
  card.classList.add("card", "card-lists", "flex-fill", "applicant-card");
  card.id = containerUniqueId;

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const img = document.createElement("img");
  img.src = "../assets/img/profiles/4.png";
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
