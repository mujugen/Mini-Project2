const globalUserArray = Array.from([
  JSON.parse(localStorage.getItem("finalApplicant")),
]);
var browsingMethod = JSON.parse(localStorage.getItem("browsingMethod"));
var apiKeyValue = JSON.parse(sessionStorage.getItem("apiKeyValue"));
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

putApplicantInfoInEAC(0);

function removeEmptyBr() {
  const container = document.querySelector("#expandedApplicantContainer");
  const brs = container.querySelectorAll("br");
  for (let i = 0; i < brs.length; i++) {
    const prevElement = brs[i].previousElementSibling;
    if (prevElement && prevElement.textContent.trim() === "") {
      brs[i].parentNode.removeChild(brs[i]);
    }
  }
}

removeEmptyBr();

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

async function fetchGetContactInfo(query) {
  const response = await fetch("http://localhost:3000/getContactInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  console.log("trying to send request to contact info");
  if (response.ok) {
    const prompt = await response.json();
    return prompt;
  } else {
    console.error("Failed to fetch contact info");
    return null;
  }
}

async function getContactInfo(query) {
  query = "De La Salle University Dasmarinas Contact Information";
  response = await fetchGetContactInfo(query);
  console.log(response);
  if (response.length > 8000) {
    response = response.substring(0, 7000) + "...";
  }
  return response;
}

async function fetchGetContactSummary(prompt) {
  const response = await fetch("http://localhost:3000/getContactSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    return null;
  }
}

async function summarizeRawContactInfo(orgName) {
  query = orgName;
  query += " Contact information (phone number/telephone number/email/address)";
  rawContactInfo = await getContactInfo(query);
  prompt = `can you find ${query} from the text below?(Keep your response short):\n`;
  prompt += rawContactInfo;
  response = await fetchGetContactSummary(prompt);
  console.log(response);
  return response;
}

var userJobSchoolArray = Array.from(
  new Set([
    globalUserArray[0].educationSchoolName1,
    globalUserArray[0].educationSchoolName2,
    globalUserArray[0].educationSchoolName3,
    globalUserArray[0].jobExperienceCompany1,
    globalUserArray[0].jobExperienceCompany2,
    globalUserArray[0].jobExperienceCompany3,
    globalUserArray[0].jobExperienceCompany4,
    globalUserArray[0].jobExperienceCompany5,
  ])
);
// Verification
// This is where the contact information is created with Google + GPT
async function createVerificationContent() {
  if (browsingMethod == "Online") {
    toggleSpinner();
    var container = $("#contact-container");

    for (const item of userJobSchoolArray) {
      container.append("<h4>" + item + "</h4>");
      contactInfo = await summarizeRawContactInfo(item);
      container.append("<h6>" + contactInfo + "</h6></br>");
    }
    toggleSpinner();
  } else {
    var container = $("#contact-container");
    container.append("<p> Must be in online mode</p>");
  }
}

let spinnerVisible = false;
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
}
