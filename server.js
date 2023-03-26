const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
// Create an Express app
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialization of openai API variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// End of open AI initialization

// Function that takes the text prompt and puts it into OpenAI API
// Returns text response
async function askPrompt(prompt) {
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

// Main function that will ask a prompt to openAI API, retrieve a response, and extract the features
// Creates and returns an Applicant class with the found features
async function CVSummarize(text) {
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

  const response = await askPrompt(prompt);
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

// Handle requests for CV summarization
app.post("/cvsummarize", async (req, res) => {
  const { pdfText } = req.body;
  try {
    const applicant = await CVSummarize(pdfText);
    res.json(applicant);
  } catch (error) {
    console.error("Error processing CV:", error);
    res.status(500).send("Failed to process CV.");
  }
});

// Set the public folder as a static folder
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Route for file upload
app.post("/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  res.send("Files uploaded successfully.");
});

// Route for listing uploaded files
app.get("/list", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).send("Failed to list uploaded files.");
    }
    res.json(files);
  });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
