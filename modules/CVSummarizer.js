// Main function that will ask a prompt to openAI API, retrieve a response, and extract the features
// Creates and returns an Applicant class with the found features
async function CVSummarize(text, openai) {
  const pdfText = text;
  const prompt = `${pdfText}\n\n\n\n\n
      can you find only these information and put them in this format,
      Full Name:
      Education:
      Experience:
      Skills:
      Certifications:
      Accomplishments:
      `;

  const response = await askPrompt(prompt, openai);
  const fullName = featureRetrieval("Full Name:", response);
  const education = featureRetrieval("Education:", response);
  const experience = featureRetrieval("Experience:", response);
  const skills = featureRetrieval("Skills:", response);
  const certifications = featureRetrieval("Certifications:", response);
  const accomplishments = featureRetrieval("Accomplishments:", response);

  const applicant = new Applicant(
    fullName,
    education,
    experience,
    skills,
    certifications,
    accomplishments
  );
  console.log("CVSummarize finished");
  return applicant;
}
// End of CVSummarize()

// Function that takes the text prompt and puts it into OpenAI API
// Returns text response
async function askPrompt(prompt, openai) {
  const model_engine = "text-davinci-003";

  console.log("Waiting for response");
  const response = await openai.createCompletion({
    model: model_engine,
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
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
      const line_without_match = line.replace(match_text, "");
      return line_without_match.trim();
    }
  }
  return null;
}
// End of featureRetrieval()

// Container for Applicant details
class Applicant {
  constructor(
    name,
    education = [],
    experience = [],
    skills = [],
    certification = [],
    accomplishment = []
  ) {
    this.name = name;
    this.education = education;
    this.skills = skills;
    this.experience = experience;
    this.certification = certification;
    this.accomplishment = accomplishment;
  }

  add_education(education) {
    this.education.push(education);
  }

  add_experience(experience) {
    this.experience.push(experience);
  }

  add_skill(skill) {
    this.skills.push(skill);
  }

  add_certification(certification) {
    this.certification.push(certification);
  }

  add_accomplishment(accomplishment) {
    this.accomplishment.push(accomplishment);
  }
}
// End of Applicant Class

module.exports = {
  CVSummarize,
};
