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
  hidePopup();
}

function searchApplicant() {
  const searchInput = document.getElementById("skillSearch");
  const searchQuery = searchInput.value.toLowerCase();
}
