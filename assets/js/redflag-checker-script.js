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
        "container_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      // Loop through redFlags object and check for values equal to 1
      for (let flag in redFlags) {
        if (redFlags[flag] == 1) {
          document.getElementById(container_id).style.backgroundColor = "red";
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

      // Format the user name into the desired ID format

      let cell_text_id =
        "cell_text_" +
        globalUserArray[i].name
          .replace(/ /g, "_")
          .replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "");
      document.getElementById(cell_text_id).appendChild(redFlag_title);
      // Append the redFlag_content element to the DOM using the formatted ID
      document.getElementById(cell_text_id).appendChild(redFlag_content);
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
