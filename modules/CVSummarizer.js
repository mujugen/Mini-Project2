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
Most Notable Skill 1:
Most Notable Skill 2:
Most Notable Skill 3:
Most Notable Skill 4:
Most Notable Skill 5:
Technical Skill 1:
Technical Skill 2:
Technical Skill 3:
Technical Skill 4:
Technical Skill 5:
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
  const education1FullTitle = featureRetrieval("Education 1 Course:", response);
  const education1SchoolName = featureRetrieval(
    "Education 1 School Name:",
    response
  );
  const education1YearEnded = featureRetrieval(
    "Education 1 Year Ended:",
    response
  );
  const education2FullTitle = featureRetrieval("Education 2 Course:", response);
  const education2SchoolName = featureRetrieval(
    "Education 2 School Name:",
    response
  );
  const education2YearEnded = featureRetrieval(
    "Education 2 Year Ended:",
    response
  );
  const education3FullTitle = featureRetrieval("Education 3 Course:", response);
  const education3SchoolName = featureRetrieval(
    "Education 3 School Name:",
    response
  );
  const education3YearEnded = featureRetrieval(
    "Education 3 Year Ended:",
    response
  );
  const mostNotableSkill1 = featureRetrieval("Most Notable Skill 1:", response);
  const mostNotableSkill2 = featureRetrieval("Most Notable Skill 2:", response);
  const mostNotableSkill3 = featureRetrieval("Most Notable Skill 3:", response);
  const mostNotableSkill4 = featureRetrieval("Most Notable Skill 4:", response);
  const mostNotableSkill5 = featureRetrieval("Most Notable Skill 5:", response);
  const programmingLanguage1 = featureRetrieval("Technical Skill 1:", response);
  const programmingLanguage2 = featureRetrieval("Technical Skill 2:", response);
  const programmingLanguage3 = featureRetrieval("Technical Skill 3:", response);
  const programmingLanguage4 = featureRetrieval("Technical Skill 4:", response);
  const programmingLanguage5 = featureRetrieval("Technical Skill 5:", response);
  const otherSkills = featureRetrieval("Other Skills:", response);
  const jobExperience1Title = featureRetrieval(
    "Job Experience 1 Title:",
    response
  );
  const jobExperience1Company = featureRetrieval(
    "Job Experience 1 Company:",
    response
  );
  const jobExperience1YearStarted = featureRetrieval(
    "Job Experience 1 Year Started:",
    response
  );
  const jobExperience1YearEnded = featureRetrieval(
    "Job Experience 1 Year Ended:",
    response
  );
  const jobExperience2Title = featureRetrieval(
    "Job Experience 2 Title:",
    response
  );
  const jobExperience2Company = featureRetrieval(
    "Job Experience 2 Company:",
    response
  );
  const jobExperience2YearStarted = featureRetrieval(
    "Job Experience 2 Year Started:",
    response
  );
  const jobExperience2YearEnded = featureRetrieval(
    "Job Experience 2 Year Ended:",
    response
  );
  const jobExperience3Title = featureRetrieval(
    "Job Experience 3 Title:",
    response
  );
  const jobExperience3Company = featureRetrieval(
    "Job Experience 3 Company:",
    response
  );
  const jobExperience3YearStarted = featureRetrieval(
    "Job Experience 3 Year Started:",
    response
  );
  const jobExperience3YearEnded = featureRetrieval(
    "Job Experience 3 Year Ended:",
    response
  );
  const jobExperience4Title = featureRetrieval(
    "Job Experience 4 Title:",
    response
  );
  const jobExperience4Company = featureRetrieval(
    "Job Experience 4 Company:",
    response
  );
  const jobExperience4YearStarted = featureRetrieval(
    "Job Experience 4 Year Started:",
    response
  );
  const jobExperience4YearEnded = featureRetrieval(
    "Job Experience 4 Year Ended:",
    response
  );
  const jobExperience5Title = featureRetrieval(
    "Job Experience 5 Title:",
    response
  );
  const jobExperience5Company = featureRetrieval(
    "Job Experience 5 Company:",
    response
  );
  const jobExperience5YearStarted = featureRetrieval(
    "Job Experience 5 Year Started:",
    response
  );
  const jobExperience5YearEnded = featureRetrieval(
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
  const reference1Name = featureRetrieval("Reference 1 Name:", response);
  const reference1Title = featureRetrieval("Reference 1 Title:", response);
  const reference1ContactInfo = featureRetrieval(
    "Reference 1 Contact Info:",
    response
  );
  const reference2Name = featureRetrieval("Reference 2 Name:", response);
  const reference2Title = featureRetrieval("Reference 2 Title:", response);
  const reference2ContactInfo = featureRetrieval(
    "Reference 2 Contact Info:",
    response
  );
  const reference3Name = featureRetrieval("Reference 3 Name:", response);
  const reference3Title = featureRetrieval("Reference 3 Title:", response);
  const reference3ContactInfo = featureRetrieval(
    "Reference 3 Contact Info:",
    response
  );
  const raw_text = text;

  const applicant = new Applicant(
    name,
    highestEducation,
    education1FullTitle,
    education1SchoolName,
    education1YearEnded,
    education2FullTitle,
    education2SchoolName,
    education2YearEnded,
    education3FullTitle,
    education3SchoolName,
    education3YearEnded,
    mostNotableSkill1,
    mostNotableSkill2,
    mostNotableSkill3,
    mostNotableSkill4,
    mostNotableSkill5,
    programmingLanguage1,
    programmingLanguage2,
    programmingLanguage3,
    programmingLanguage4,
    programmingLanguage5,
    otherSkills,
    jobExperience1Title,
    jobExperience1Company,
    jobExperience1YearStarted,
    jobExperience1YearEnded,
    jobExperience2Title,
    jobExperience2Company,
    jobExperience2YearStarted,
    jobExperience2YearEnded,
    jobExperience3Title,
    jobExperience3Company,
    jobExperience3YearStarted,
    jobExperience3YearEnded,
    jobExperience4Title,
    jobExperience4Company,
    jobExperience4YearStarted,
    jobExperience4YearEnded,
    jobExperience5Title,
    jobExperience5Company,
    jobExperience5YearStarted,
    jobExperience5YearEnded,
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
    reference1Name,
    reference1Title,
    reference1ContactInfo,
    reference2Name,
    reference2Title,
    reference2ContactInfo,
    reference3Name,
    reference3Title,
    reference3ContactInfo,
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
    education1FullTitle,
    education1SchoolName,
    education1YearEnded,
    education2FullTitle,
    education2SchoolName,
    education2YearEnded,
    education3FullTitle,
    education3SchoolName,
    education3YearEnded,
    mostNotableSkill1,
    mostNotableSkill2,
    mostNotableSkill3,
    mostNotableSkill4,
    mostNotableSkill5,
    programmingLanguage1,
    programmingLanguage2,
    programmingLanguage3,
    programmingLanguage4,
    programmingLanguage5,
    otherSkills,
    jobExperience1Title,
    jobExperience1Company,
    jobExperience1YearStarted,
    jobExperience1YearEnded,
    jobExperience2Title,
    jobExperience2Company,
    jobExperience2YearStarted,
    jobExperience2YearEnded,
    jobExperience3Title,
    jobExperience3Company,
    jobExperience3YearStarted,
    jobExperience3YearEnded,
    jobExperience4Title,
    jobExperience4Company,
    jobExperience4YearStarted,
    jobExperience4YearEnded,
    jobExperience5Title,
    jobExperience5Company,
    jobExperience5YearStarted,
    jobExperience5YearEnded,
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
    reference1Name,
    reference1Title,
    reference1ContactInfo,
    reference2Name,
    reference2Title,
    reference2ContactInfo,
    reference3Name,
    reference3Title,
    reference3ContactInfo,
    raw_text
  ) {
    this.name = name;
    this.highestEducation = highestEducation;
    this.education1FullTitle = education1FullTitle;
    this.education1SchoolName = education1SchoolName;
    this.education1YearEnded = education1YearEnded;
    this.education2FullTitle = education2FullTitle;
    this.education2SchoolName = education2SchoolName;
    this.education2YearEnded = education2YearEnded;
    this.education3FullTitle = education3FullTitle;
    this.education3SchoolName = education3SchoolName;
    this.education3YearEnded = education3YearEnded;
    this.mostNotableSkill1 = mostNotableSkill1;
    this.mostNotableSkill2 = mostNotableSkill2;
    this.mostNotableSkill3 = mostNotableSkill3;
    this.mostNotableSkill4 = mostNotableSkill4;
    this.mostNotableSkill5 = mostNotableSkill5;
    this.programmingLanguage1 = programmingLanguage1;
    this.programmingLanguage2 = programmingLanguage2;
    this.programmingLanguage3 = programmingLanguage3;
    this.programmingLanguage4 = programmingLanguage4;
    this.programmingLanguage5 = programmingLanguage5;
    this.otherSkills = otherSkills;
    this.jobExperience1Title = jobExperience1Title;
    this.jobExperience1Company = jobExperience1Company;
    this.jobExperience1YearStarted = jobExperience1YearStarted;
    this.jobExperience1YearEnded = jobExperience1YearEnded;
    this.jobExperience2Title = jobExperience2Title;
    this.jobExperience2Company = jobExperience2Company;
    this.jobExperience2YearStarted = jobExperience2YearStarted;
    this.jobExperience2YearEnded = jobExperience2YearEnded;
    this.jobExperience3Title = jobExperience3Title;
    this.jobExperience3Company = jobExperience3Company;
    this.jobExperience3YearStarted = jobExperience3YearStarted;
    this.jobExperience3YearEnded = jobExperience3YearEnded;
    this.jobExperience4Title = jobExperience4Title;
    this.jobExperience4Company = jobExperience4Company;
    this.jobExperience4YearStarted = jobExperience4YearStarted;
    this.jobExperience4YearEnded = jobExperience4YearEnded;
    this.jobExperience5Title = jobExperience5Title;
    this.jobExperience5Company = jobExperience5Company;
    this.jobExperience5YearStarted = jobExperience5YearStarted;
    this.jobExperience5YearEnded = jobExperience5YearEnded;
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
    this.reference1Name = reference1Name;
    this.reference1Title = reference1Title;
    this.reference1ContactInfo = reference1ContactInfo;
    this.reference2Name = reference2Name;
    this.reference2Title = reference2Title;
    this.reference2ContactInfo = reference2ContactInfo;
    this.reference3Name = reference3Name;
    this.reference3Title = reference3Title;
    this.reference3ContactInfo = reference3ContactInfo;
    this.raw_text = raw_text;
  }
}

// End of Applicant Class

module.exports = {
  CVSummarize,
};
