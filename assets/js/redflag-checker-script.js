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
  const response = await fetch("http://localhost:3000/redFlagRemover", {
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

// Identifies which cards has a red flag and marks them red
async function runRedFlag() {
  filters = getSelectedFilters();
  if (filters.length != 0) {
    for (let i = 0; i < globalUserArray.length; i++) {
      let redFlags;
      if (globalUserArray[i].red_flag_1 == null) {
        console.log(
          `User ${globalUserArray[i].name} doesn't have red flags in DB`
        );
        redFlags = await fetchredFlagRemover(
          globalUserArray[i].raw_text,
          filters,
          globalUserArray[i].name
        );
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
        if (redFlags[flag] == 1) {
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
  } else {
    alert("No filters selected");
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
