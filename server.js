const { CVSummarize } = require("./modules/CVSummarizer.js");
const { redFlagRemover } = require("./modules/redFlagRemover.js");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const sqlite3 = require("sqlite3").verbose();
// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Initialize the SQLite database
const db = new sqlite3.Database("users.db");

// Create a table to store user data
db.run(
  "CREATE TABLE IF NOT EXISTS users \
  (\
    id INTEGER PRIMARY KEY, \
    name TEXT NOT NULL UNIQUE, \
    highestEducation TEXT, \
    education1FullTitle TEXT, \
    education1SchoolName TEXT, \
    education1YearEnded TEXT, \
    education2FullTitle TEXT, \
    education2SchoolName TEXT, \
    education2YearEnded TEXT, \
    education3FullTitle TEXT, \
    education3SchoolName TEXT, \
    education3YearEnded TEXT, \
    mostNotableSkill1 TEXT, \
    mostNotableSkill2 TEXT, \
    mostNotableSkill3 TEXT, \
    mostNotableSkill4 TEXT, \
    mostNotableSkill5 TEXT, \
    programmingLanguage1 TEXT, \
    programmingLanguage2 TEXT, \
    programmingLanguage3 TEXT, \
    programmingLanguage4 TEXT, \
    programmingLanguage5 TEXT, \
    otherSkills TEXT, \
    jobExperience1Title TEXT, \
    jobExperience1Company TEXT, \
    jobExperience1YearStarted TEXT, \
    jobExperience1YearEnded TEXT, \
    jobExperience2Title TEXT, \
    jobExperience2Company TEXT, \
    jobExperience2YearStarted TEXT, \
    jobExperience2YearEnded TEXT, \
    jobExperience3Title TEXT, \
    jobExperience3Company TEXT, \
    jobExperience3YearStarted TEXT, \
    jobExperience3YearEnded TEXT, \
    jobExperience4Title TEXT, \
    jobExperience4Company TEXT, \
    jobExperience4YearStarted TEXT, \
    jobExperience4YearEnded TEXT, \
    jobExperience5Title TEXT, \
    jobExperience5Company TEXT, \
    jobExperience5YearStarted TEXT, \
    jobExperience5YearEnded TEXT, \
    certification1Title TEXT, \
    certification2Title TEXT, \
    certification3Title TEXT, \
    certification4Title TEXT, \
    certification5Title TEXT, \
    accomplishment1Title TEXT, \
    accomplishment2Title TEXT, \
    accomplishment3Title TEXT, \
    accomplishment4Title TEXT, \
    accomplishment5Title TEXT, \
    reference1Name TEXT, \
    reference1Title TEXT, \
    reference1ContactInfo TEXT, \
    reference2Name TEXT, \
    reference2Title TEXT, \
    reference2ContactInfo TEXT, \
    reference3Name TEXT, \
    reference3Title TEXT, \
    reference3ContactInfo TEXT, \
    raw_text TEXT, \
    red_flag_1 BOOLEAN, \
    red_flag_2 BOOLEAN, \
    red_flag_3 BOOLEAN, \
    red_flag_4 BOOLEAN, \
    red_flag_5 BOOLEAN, \
    red_flag_6 BOOLEAN, \
    red_flag_7 BOOLEAN, \
    red_flag_8 BOOLEAN\
    )"
);

function insertUser(userData) {
  let {
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
    raw_text,
  } = userData;
  if (name == "") {
    return;
  }
  db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      console.log(`User ${name} already exists with ID: ${row.id}`);
    } else {
      db.run(
        `INSERT INTO users (
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
          raw_text,
        ],
        function (err) {
          if (err) {
            console.log(err.message);
          }
          console.log(`User ${name} added with ID: ${this.lastID}`);
        }
      );
    }
  });
}

function insertRedFlags(name, redFlags) {
  const {
    red_flag_1,
    red_flag_2,
    red_flag_3,
    red_flag_4,
    red_flag_5,
    red_flag_6,
    red_flag_7,
    red_flag_8,
  } = redFlags;

  db.run(
    `UPDATE users SET red_flag_1 = ?, red_flag_2 = ?, red_flag_3 = ?, red_flag_4 = ?, red_flag_5 = ?, red_flag_6 = ?, red_flag_7 = ?, red_flag_8 = ? WHERE name = ?`,
    [
      red_flag_1,
      red_flag_2,
      red_flag_3,
      red_flag_4,
      red_flag_5,
      red_flag_6,
      red_flag_7,
      red_flag_8,
      name,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      if (this.changes === 0) {
        console.log(`User ${name} not found`);
      } else {
        console.log(`Red flags updated for user ${name}`);
      }
    }
  );
}

function getUsers(callback) {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });
}

app.get("/users", (req, res) => {
  getUsers((users) => {
    res.json(users);
  });
});

app.post("/applicantByRawText", (req, res) => {
  // Check if the request body contains the expected `rawText` property
  if (!req.body || !req.body.rawText) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  // Extract the `rawText` property from the request body
  const rawText = req.body.rawText;

  console.error("calling getApplicantByRawText");

  // Call the `getApplicantByRawText` function with the `rawText` parameter
  getApplicantByRawText(rawText, (applicant) => {
    if (applicant) {
      res.json(applicant);
    } else {
      res.status(404).json({ message: "Applicant not found" });
    }
  });
});

app.post("/applicantByName", (req, res) => {
  // Check if the request body contains the expected `rawText` property
  if (!req.body || !req.body.name) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  // Extract the `rawText` property from the request body
  const name = req.body.name;

  console.error("calling getApplicantByName");

  getApplicantByName(name, (applicant) => {
    if (applicant) {
      res.json(applicant);
    } else {
      res.status(404).json({ message: "Applicant not found" });
    }
  });
});

function getApplicantByName(name, callback) {
  db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error(err.message);
      console.error("getApplicantByName failed to get row");
      callback(null);
      return;
    }

    if (row) {
      callback(row);
      console.error("getApplicantByName found matching row");
    } else {
      callback(null);
      console.error("getApplicantByName no matching row");
    }
  });
}

function getApplicantByRawText(rawText, callback) {
  db.get("SELECT * FROM users WHERE raw_text = ?", [rawText], (err, row) => {
    if (err) {
      console.error(err.message);
      console.error("getApplicantByRawText failed to get row");
      callback(null);
      return;
    }

    if (row) {
      callback(row);
      console.error("getApplicantByRawText found matching row");
    } else {
      callback(null);
      console.error("getApplicantByRawText no matching row");
    }
  });
}

// Initialization of openai API variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// End of open AI initialization

// Handle requests for redFlagRemover
app.post("/redFlagRemover", async (req, res) => {
  const { rawText, filters, name } = req.body;
  console.log(`${name} received`);
  try {
    var redFlags = await redFlagRemover(rawText, openai, filters, name);
    insertRedFlags(name, redFlags);
    res.json(redFlags);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed" });
  }
});

// Handle requests for CV summarization
app.post("/cvsummarize", async (req, res) => {
  const { pdfText } = req.body;
  try {
    const applicant = await CVSummarize(pdfText, openai);
    console.log(applicant);
    insertUser(applicant); // Insert the user data into the database
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
