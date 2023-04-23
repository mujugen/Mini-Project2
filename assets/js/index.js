const globalUserArray = JSON.parse(localStorage.getItem("globalUserArray"));
function hidePopup() {
  $("#popup_card").remove();
  $("#popup_overlay").remove();
}

var browsingMethod = JSON.parse(localStorage.getItem("browsingMethod"));
var apiKeyValue = JSON.parse(sessionStorage.getItem("apiKeyValue"));
function offlineButtonClicked() {
  browsingMethod = "Offline";
  localStorage.setItem("browsingMethod", JSON.stringify(browsingMethod));
  apiKeyValue = null;
  hidePopup();
}

function onlineButtonClicked() {
  apiKeyValue = $("#APIKeyTextBox").val();
  browsingMethod = "Online";
  localStorage.setItem("browsingMethod", JSON.stringify(browsingMethod));
  sessionStorage.setItem("apiKeyValue", JSON.stringify(apiKeyValue));
  initializeApiKey(apiKeyValue);
  hidePopup();
}

function searchApplicant() {
  const searchInput = document.getElementById("skillSearch");
  const searchQuery = searchInput.value.toLowerCase();
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

async function getCurrentApiKey() {
  try {
    const response = await fetch("/get-current-api-key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Current API key:", data.apiKey);
  } catch (error) {
    console.error("Error getting current API key:", error);
  }
}

async function clearApiKey() {
  try {
    const response = await fetch("/clear-api-key", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API key cleared:", data);
  } catch (error) {
    console.error("Error clearing API key:", error);
  }
}

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

function addUserDivs(globalUserArray) {
  const container = document.getElementById("usersInGUAContainer");

  for (let i = 0; i < globalUserArray.length; i++) {
    const userDiv = document.createElement("div");
    userDiv.classList.add("team-list");
    userDiv.innerHTML = `
      <div class="team-view">
        <div class="team-img">
          <img src="${getRandomImage()}" alt="avatar" />
        </div>
        <div class="team-content">
          <a href="#">${globalUserArray[i].name}</a>
          <span>${globalUserArray[i].highestEducation}</span>
        </div>
      </div>
    `;
    container.appendChild(userDiv);
  }
}

addUserDivs(globalUserArray);

document.getElementById("skillSearch").addEventListener("keyup", function () {
  const searchQuery = this.value.toLowerCase();
  const applicantList = document.getElementById("usersInGUAContainer");
  const teamLists = applicantList.getElementsByClassName("team-list");

  for (let i = 0; i < teamLists.length; i++) {
    const nameElement = teamLists[i].querySelector(".team-content a");
    const nameText = nameElement.textContent || nameElement.innerText;
    const spanElement = teamLists[i].querySelector(".team-content span");
    const spanText = spanElement.textContent || spanElement.innerText;

    if (
      nameText.toLowerCase().indexOf(searchQuery) !== -1 ||
      spanText.toLowerCase().indexOf(searchQuery) !== -1
    ) {
      teamLists[i].style.display = "";
    } else {
      teamLists[i].style.display = "none";
    }
  }
});
