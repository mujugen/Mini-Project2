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
