const globalUserArray = JSON.parse(localStorage.getItem("finalApplicant"));

$("#user_name").text(globalUserArray.name);
$("#education1").text(globalUserArray.educationFullTitle1);
$("#education1school").text(globalUserArray.educationSchoolName1);
$("#education1year").text(globalUserArray.educationYearEnded1);
$("#education2").text(globalUserArray.educationFullTitle2);
$("#education2school").text(globalUserArray.educationSchoolName2);
$("#education2year").text(globalUserArray.educationYearEnded2);
$("#education3").text(globalUserArray.educationFullTitle3);
$("#education3school").text(globalUserArray.educationSchoolName3);
$("#education3year").text(globalUserArray.educationYearEnded3);
$("#experience1").text(globalUserArray.jobExperienceTitle1);
$("#experience1company").text(globalUserArray.jobExperienceCompany1);
$("#experience1year").text(globalUserArray.jobExperienceYearEnded1);
$("#experience2").text(globalUserArray.jobExperienceTitle2);
$("#experience2company").text(globalUserArray.jobExperienceCompany2);
$("#experience2year").text(globalUserArray.jobExperienceYearEnded2);
$("#experience3").text(globalUserArray.jobExperienceTitle3);
$("#experience3company").text(globalUserArray.jobExperienceCompany3);
$("#experience3year").text(globalUserArray.jobExperienceYearEnded3);
$("#experience4").text(globalUserArray.jobExperience4Title);
$("#experience4company").text(globalUserArray.jobExperienceCompany4);
$("#experience4year").text(globalUserArray.jobExperienceYearEnded4);
$("#experience5").text(globalUserArray.jobExperience5Title);
$("#experience5company").text(globalUserArray.jobExperienceCompany5);
$("#experience5year").text(globalUserArray.jobExperienceYearEnded5);
$("#skill1").text(globalUserArray.skill1);
$("#skill2").text(globalUserArray.skill2);
$("#skill3").text(globalUserArray.skill3);
$("#skill4").text(globalUserArray.skill4);
$("#skill5").text(globalUserArray.skill5);
$("#skill6").text(globalUserArray.skill6);
$("#skill7").text(globalUserArray.skill7);
$("#skill8").text(globalUserArray.skill8);
$("#skill9").text(globalUserArray.skill9);
$("#skill10").text(globalUserArray.skill10);
$("#certification1").text(globalUserArray.certification1Title);
$("#certification2").text(globalUserArray.certification2Title);
$("#certification3").text(globalUserArray.certification3Title);
$("#certification4").text(globalUserArray.certification4Title);
$("#certification5").text(globalUserArray.certification5Title);
$("#accomplishment1").text(globalUserArray.accomplishment1Title);
$("#accomplishment2").text(globalUserArray.accomplishment2Title);
$("#accomplishment3").text(globalUserArray.accomplishment3Title);
$("#accomplishment4").text(globalUserArray.accomplishment4Title);
$("#accomplishment5").text(globalUserArray.accomplishment5Title);
$("#phoneNumber").text(globalUserArray.phoneNumber);
$("#emailAddress").text(globalUserArray.emailAddress);
$("#homeAddress").text(globalUserArray.homeAddress);
function hideEmptyElements(selector, valuesToHide) {
  $(selector).each(function () {
    if (valuesToHide.includes($(this).text())) {
      $(this).hide();
    }
  });
}

let valuesToHide = ["N/A", "None", ""];
const parent_container = document.getElementById("user_text_container");
const childrenIds = [];

for (let i = 0; i < parent_container.children.length; i++) {
  const child = parent_container.children[i];
  if (child.id) {
    // Only push child ID if it exists
    childrenIds.push("#" + child.id);
  }
}

const selector = childrenIds.join(",");

hideEmptyElements(selector, valuesToHide);

async function displayPDF(fileName) {
  const response = await fetch(`/uploads/${fileName}`);
  if (!response.ok) {
    console.error("Failed to fetch the PDF file");
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const pdfData = new Uint8Array(arrayBuffer);

  // Load and display the PDF
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const container = document.getElementById("pdf-container");
  const containerWidth = container.clientWidth;
  const numPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    // Render each page of the PDF
    const page = await pdf.getPage(pageNum);
    const scale = containerWidth / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width * 0.9;
    canvas.height = viewport.height * 0.9;
    container.appendChild(canvas);

    const context = canvas.getContext("2d");
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  }
}

displayPDF("Miguel_Sicart.pdf");

////////////////

// function to make email template
function makeEmailTemplate() {
  const prompt = `Dear ${globalUserArray.name},<br><br>
    I hope this message finds you well. I am writing to offer you an interview for the position you applied for at our company. We were impressed by your qualifications and experience, and we believe that you could be a valuable addition to our team.<br><br>
    
    To schedule your interview, please let us know your availability within the next week. We are looking to conduct interviews as soon as possible and we want to ensure we can accommodate your schedule.<br><br>
    
    If there is a particular date or time that works best for you, please let us know and we will do our best to accommodate your schedule. Additionally, if there are any specific accommodations or requirements you need during the interview process, please don't hesitate to inform us so we can make appropriate arrangements.<br><br>
    
    Please let us know your availability at your earliest convenience. We look forward to hearing back from you soon and hopefully having the opportunity to meet you in person.<br><br>
    
    Best regards,<br><br>
    
    John Watson<br>
    ABC Company`;

  $("#emailTemplate").html(prompt);
}
makeEmailTemplate();

async function fetchGetContactInfo(query) {
  const response = await fetch("/getContactInfo", {
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
  const response = await fetch("/getContactSummary", {
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
    globalUserArray.educationSchoolName1,
    globalUserArray.educationSchoolName2,
    globalUserArray.educationSchoolName3,
    globalUserArray.jobExperienceCompany1,
    globalUserArray.jobExperienceCompany2,
    globalUserArray.jobExperienceCompany3,
    globalUserArray.jobExperienceCompany4,
    globalUserArray.jobExperienceCompany5,
  ])
);
// Verification
// This is where the contact information is created with Google + GPT
async function createVerificationContent() {
  var container = $("#contact-container");

  for (const item of userJobSchoolArray) {
    container.append("<p>" + item + "</p>");
    contactInfo = await summarizeRawContactInfo(item);
    container.append("<p>" + contactInfo + "</p>");
  }
}
