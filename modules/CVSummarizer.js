// Main function that will ask a prompt to openAI API, retrieve a response, and extract the features
// Creates and returns an Applicant class with the found features
async function CVSummarize(text, openai) {
  const pdfText = text;
  const prompt = `${pdfText}\n\n\n\n\n
can you find only these information and put them in this format,
Full Name:
Highest Education (|Highscool Diploma|Bachelor|Masters|Phd):
Education 1 Course:
Education 1 School Name:
Education 1 Year Ended:
Education 2 Course:
Education 2 School Name:
Education 2 Year Ended:
Education 3 Course:
Education 3 School Name:
Education 3 Year Ended:
Technical Skill 1:
Technical Skill 2:
Technical Skill 3:
Technical Skill 4:
Technical Skill 5:
Technical Skill 6:
Technical Skill 7:
Technical Skill 8:
Technical Skill 9:
Technical Skill 10:
Other Skills:
Job Experience 1 Title:
Job Experience 1 Company:
Job Experience 1 Year Started:
Job Experience 1 Year Ended:
Job Experience 2 Title:
Job Experience 2 Company:
Job Experience 2 Year Started:
Job Experience 2 Year Ended:
Job Experience 3 Title:
Job Experience 3 Company:
Job Experience 3 Year Started:
Job Experience 3 Year Ended:
Job Experience 4 Title:
Job Experience 4 Company:
Job Experience 4 Year Started:
Job Experience 4 Year Ended:
Job Experience 5 Title:
Job Experience 5 Company:
Job Experience 5 Year Started:
Job Experience 5 Year Ended:
Certification 1 Title:
Certification 2 Title:
Certification 3 Title:
Certification 4 Title:
Certification 5 Title:
Accomplishment 1 Title:
Accomplishment 2 Title:
Accomplishment 3 Title:
Accomplishment 4 Title:
Accomplishment 5 Title:
Reference 1 Name:
Reference 1 Title:
Reference 1 Contact information:
Reference 2 Name:
Reference 2 Title:
Reference 2 Contact information:
Reference 3 Name:
Reference 3 Title:
Reference 3 Contact information:

`;

  const response = await askPrompt(prompt, openai);
  const name = featureRetrieval("Full Name:", response);
  const highestEducation = featureRetrieval("Highest Education:", response);
  const educationFullTitle1 = featureRetrieval("Education 1 Course:", response);
  const educationSchoolName1 = featureRetrieval(
    "Education 1 School Name:",
    response
  );
  const educationYearEnded1 = featureRetrieval(
    "Education 1 Year Ended:",
    response
  );
  const educationFullTitle2 = featureRetrieval("Education 2 Course:", response);
  const educationSchoolName2 = featureRetrieval(
    "Education 2 School Name:",
    response
  );
  const educationYearEnded2 = featureRetrieval(
    "Education 2 Year Ended:",
    response
  );
  const educationFullTitle3 = featureRetrieval("Education 3 Course:", response);
  const educationSchoolName3 = featureRetrieval(
    "Education 3 School Name:",
    response
  );
  const educationYearEnded3 = featureRetrieval(
    "Education 3 Year Ended:",
    response
  );
  
  const skill1 = featureRetrieval("Technical Skill 1:", response);
  const skill2 = featureRetrieval("Technical Skill 2:", response);
  const skill3 = featureRetrieval("Technical Skill 3:", response);
  const skill4 = featureRetrieval("Technical Skill 4:", response);
  const skill5 = featureRetrieval("Technical Skill 5:", response);
  const skill6 = featureRetrieval("Technical Skill 6:", response);
  const skill7 = featureRetrieval("Technical Skill 7:", response);
  const skill8 = featureRetrieval("Technical Skill 8:", response);
  const skill9 = featureRetrieval("Technical Skill 9:", response);
  const skill10 = featureRetrieval("Technical Skill 10:", response);
  const otherSkills = featureRetrieval("Other Skills:", response);
  const jobExperienceTitle1 = featureRetrieval(
    "Job Experience 1 Title:",
    response
  );
  const jobExperienceCompany1 = featureRetrieval(
    "Job Experience 1 Company:",
    response
  );
  const jobExperienceYearStarted1 = featureRetrieval(
    "Job Experience 1 Year Started:",
    response
  );
  const jobExperienceYearEnded1 = featureRetrieval(
    "Job Experience 1 Year Ended:",
    response
  );
  const jobExperienceTitle2 = featureRetrieval(
    "Job Experience 2 Title:",
    response
  );
  const jobExperienceCompany2 = featureRetrieval(
    "Job Experience 2 Company:",
    response
  );
  const jobExperienceYearStarted2 = featureRetrieval(
    "Job Experience 2 Year Started:",
    response
  );
  const jobExperienceYearEnded2 = featureRetrieval(
    "Job Experience 2 Year Ended:",
    response
  );
  const jobExperienceTitle3 = featureRetrieval(
    "Job Experience 3 Title:",
    response
  );
  const jobExperienceCompany3 = featureRetrieval(
    "Job Experience 3 Company:",
    response
  );
  const jobExperienceYearStarted3 = featureRetrieval(
    "Job Experience 3 Year Started:",
    response
  );
  const jobExperienceYearEnded3 = featureRetrieval(
    "Job Experience 3 Year Ended:",
    response
  );
  const jobExperience4Title = featureRetrieval(
    "Job Experience 4 Title:",
    response
  );
  const jobExperienceCompany4 = featureRetrieval(
    "Job Experience 4 Company:",
    response
  );
  const jobExperience4YearStarted = featureRetrieval(
    "Job Experience 4 Year Started:",
    response
  );
  const jobExperienceYearEnded4 = featureRetrieval(
    "Job Experience 4 Year Ended:",
    response
  );
  const jobExperience5Title = featureRetrieval(
    "Job Experience 5 Title:",
    response
  );
  const jobExperienceCompany5 = featureRetrieval(
    "Job Experience 5 Company:",
    response
  );
  const jobExperienceYearStarted5 = featureRetrieval(
    "Job Experience 5 Year Started:",
    response
  );
  const jobExperienceYearEnded5 = featureRetrieval(
    "Job Experience 5 Year Ended:",
    response
  );
  const certification1Title = featureRetrieval(
    "Certification 1 Title:",
    response
  );
  const certification2Title = featureRetrieval(
    "Certification 2 Title:",
    response
  );
  const certification3Title = featureRetrieval(
    "Certification 3 Title:",
    response
  );
  const certification4Title = featureRetrieval(
    "Certification 4 Title:",
    response
  );
  const certification5Title = featureRetrieval(
    "Certification 5 Title:",
    response
  );
  const accomplishment1Title = featureRetrieval(
    "Accomplishment 1 Title:",
    response
  );
  const accomplishment2Title = featureRetrieval(
    "Accomplishment 2 Title:",
    response
  );
  const accomplishment3Title = featureRetrieval(
    "Accomplishment 3 Title:",
    response
  );
  const accomplishment4Title = featureRetrieval(
    "Accomplishment 4 Title:",
    response
  );
  const accomplishment5Title = featureRetrieval(
    "Accomplishment 5 Title:",
    response
  );
  const referenceName1 = featureRetrieval("Reference 1 Name:", response);
  const referenceTitle1 = featureRetrieval("Reference 1 Title:", response);
  const referenceContactInfo1 = featureRetrieval(
    "Reference 1 Contact Info:",
    response
  );
  const referenceName2 = featureRetrieval("Reference 2 Name:", response);
  const referenceTitle2 = featureRetrieval("Reference 2 Title:", response);
  const referenceContactInfo2 = featureRetrieval(
    "Reference 2 Contact Info:",
    response
  );
  const referenceName3 = featureRetrieval("Reference 3 Name:", response);
  const referenceTitle3 = featureRetrieval("Reference 3 Title:", response);
  const referenceContactInfo3 = featureRetrieval(
    "Reference 3 Contact Info:",
    response
  );
  const raw_text = text;

  const applicant = new Applicant(
    name,
    highestEducation,
    educationFullTitle1,
    educationSchoolName1,
    educationYearEnded1,
    educationFullTitle2,
    educationSchoolName2,
    educationYearEnded2,
    educationFullTitle3,
    educationSchoolName3,
    educationYearEnded3,
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
    skill6,
    skill7,
    skill8,
    skill9,
    skill10,
    otherSkills,
    jobExperienceTitle1,
    jobExperienceCompany1,
    jobExperienceYearStarted1,
    jobExperienceYearEnded1,
    jobExperienceTitle2,
    jobExperienceCompany2,
    jobExperienceYearStarted2,
    jobExperienceYearEnded2,
    jobExperienceTitle3,
    jobExperienceCompany3,
    jobExperienceYearStarted3,
    jobExperienceYearEnded3,
    jobExperience4Title,
    jobExperienceCompany4,
    jobExperience4YearStarted,
    jobExperienceYearEnded4,
    jobExperience5Title,
    jobExperienceCompany5,
    jobExperienceYearStarted5,
    jobExperienceYearEnded5,
    certification1Title,
    certification2Title,
    certification3Title,
    certification4Title,
    certification5Title,
    accomplishment1Title,
    accomplishment2Title,
    accomplishment3Title,
    accomplishment4Title,
    accomplishment5Title,
    referenceName1,
    referenceTitle1,
    referenceContactInfo1,
    referenceName2,
    referenceTitle2,
    referenceContactInfo2,
    referenceName3,
    referenceTitle3,
    referenceContactInfo3,
    raw_text
  );
  console.log("CVSummarize finished");
  return applicant;
}
// End of CVSummarize()

// Function that takes the text prompt and puts it into OpenAI API
// Returns text response
async function askPrompt(prompt, openai) {
  const model_engine = "text-davinci-003";
  /* const model_engine = "gpt-3.5-turbo"; */

  console.log("Waiting for response");
  const response = await openai.createCompletion({
    model: model_engine,
    prompt: prompt,
    temperature: 0,
    max_tokens: 2000,
    n: 1,
    top_p: 1.0,
  });
  console.log("Response received\n");
  return response.data.choices[0].text;
}
// End of askPrompt function

// Function that takes any text and returns lines that match the match text
// Returned matched text if found, and null if not
function featureRetrieval(match_text, text) {
  const lines = text.split("\n");
  for (const line of lines) {
    if (line.includes(match_text)) {
      let line_without_match = line.replace(match_text, "");
      if (line_without_match == "") {
        line_without_match = "N/A";
      }
      return line_without_match.trim();
    }
  }
  return "N/A";
}
// End of featureRetrieval()

// Container for Applicant details
class Applicant {
  constructor(
    name,
    highestEducation,
    educationFullTitle1,
    educationSchoolName1,
    educationYearEnded1,
    educationFullTitle2,
    educationSchoolName2,
    educationYearEnded2,
    educationFullTitle3,
    educationSchoolName3,
    educationYearEnded3,
    skill1,
    skill2,
    skill3,
    skill4,
    skill5,
    skill6,
    skill7,
    skill8,
    skill9,
    skill10,
    otherSkills,
    jobExperienceTitle1,
    jobExperienceCompany1,
    jobExperienceYearStarted1,
    jobExperienceYearEnded1,
    jobExperienceTitle2,
    jobExperienceCompany2,
    jobExperienceYearStarted2,
    jobExperienceYearEnded2,
    jobExperienceTitle3,
    jobExperienceCompany3,
    jobExperienceYearStarted3,
    jobExperienceYearEnded3,
    jobExperience4Title,
    jobExperienceCompany4,
    jobExperience4YearStarted,
    jobExperienceYearEnded4,
    jobExperience5Title,
    jobExperienceCompany5,
    jobExperienceYearStarted5,
    jobExperienceYearEnded5,
    certification1Title,
    certification2Title,
    certification3Title,
    certification4Title,
    certification5Title,
    accomplishment1Title,
    accomplishment2Title,
    accomplishment3Title,
    accomplishment4Title,
    accomplishment5Title,
    referenceName1,
    referenceTitle1,
    referenceContactInfo1,
    referenceName2,
    referenceTitle2,
    referenceContactInfo2,
    referenceName3,
    referenceTitle3,
    referenceContactInfo3,
    raw_text
  ) {
    this.name = name;
    this.highestEducation = highestEducation;
    this.educationFullTitle1 = educationFullTitle1;
    this.educationSchoolName1 = educationSchoolName1;
    this.educationYearEnded1 = educationYearEnded1;
    this.educationFullTitle2 = educationFullTitle2;
    this.educationSchoolName2 = educationSchoolName2;
    this.educationYearEnded2 = educationYearEnded2;
    this.educationFullTitle3 = educationFullTitle3;
    this.educationSchoolName3 = educationSchoolName3;
    this.educationYearEnded3 = educationYearEnded3;
    this.skill1 = skill1;
    this.skill2 = skill2;
    this.skill3 = skill3;
    this.skill4 = skill4;
    this.skill5 = skill5;
    this.skill6 = skill6;
    this.skill7 = skill7;
    this.skill8 = skill8;
    this.skill9 = skill9;
    this.skill10 = skill10;
    this.otherSkills = otherSkills;
    this.jobExperienceTitle1 = jobExperienceTitle1;
    this.jobExperienceCompany1 = jobExperienceCompany1;
    this.jobExperienceYearStarted1 = jobExperienceYearStarted1;
    this.jobExperienceYearEnded1 = jobExperienceYearEnded1;
    this.jobExperienceTitle2 = jobExperienceTitle2;
    this.jobExperienceCompany2 = jobExperienceCompany2;
    this.jobExperienceYearStarted2 = jobExperienceYearStarted2;
    this.jobExperienceYearEnded2 = jobExperienceYearEnded2;
    this.jobExperienceTitle3 = jobExperienceTitle3;
    this.jobExperienceCompany3 = jobExperienceCompany3;
    this.jobExperienceYearStarted3 = jobExperienceYearStarted3;
    this.jobExperienceYearEnded3 = jobExperienceYearEnded3;
    this.jobExperience4Title = jobExperience4Title;
    this.jobExperienceCompany4 = jobExperienceCompany4;
    this.jobExperience4YearStarted = jobExperience4YearStarted;
    this.jobExperienceYearEnded4 = jobExperienceYearEnded4;
    this.jobExperience5Title = jobExperience5Title;
    this.jobExperienceCompany5 = jobExperienceCompany5;
    this.jobExperienceYearStarted5 = jobExperienceYearStarted5;
    this.jobExperienceYearEnded5 = jobExperienceYearEnded5;
    this.certification1Title = certification1Title;
    this.certification2Title = certification2Title;
    this.certification3Title = certification3Title;
    this.certification4Title = certification4Title;
    this.certification5Title = certification5Title;
    this.accomplishment1Title = accomplishment1Title;
    this.accomplishment2Title = accomplishment2Title;
    this.accomplishment3Title = accomplishment3Title;
    this.accomplishment4Title = accomplishment4Title;
    this.accomplishment5Title = accomplishment5Title;
    this.referenceName1 = referenceName1;
    this.referenceTitle1 = referenceTitle1;
    this.referenceContactInfo1 = referenceContactInfo1;
    this.referenceName2 = referenceName2;
    this.referenceTitle2 = referenceTitle2;
    this.referenceContactInfo2 = referenceContactInfo2;
    this.referenceName3 = referenceName3;
    this.referenceTitle3 = referenceTitle3;
    this.referenceContactInfo3 = referenceContactInfo3;
    this.raw_text = raw_text;
  }
}

// End of Applicant Class

module.exports = {
  CVSummarize,
};
