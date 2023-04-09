const { CVSummarize } = require("./assets/js/CVSummarizer.js");
const { askRank } = require("./assets/js/askRanking.js");
const { getContactInfo } = require("./assets/js/getContactInfo.js");
const { getContactSummary } = require("./assets/js/getContactSummary.js");
const { redFlagRemover } = require("./assets/js/redFlagRemover.js");
const express = require("express");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
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
    educationFullTitle1 TEXT, \
    educationSchoolName1 TEXT, \
    educationYearEnded1 TEXT, \
    educationFullTitle2 TEXT, \
    educationSchoolName2 TEXT, \
    educationYearEnded2 TEXT, \
    educationFullTitle3 TEXT, \
    educationSchoolName3 TEXT, \
    educationYearEnded3 TEXT, \
    skill1 TEXT, \
    skill2 TEXT, \
    skill3 TEXT, \
    skill4 TEXT, \
    skill5 TEXT, \
    skill6 TEXT, \
    skill7 TEXT, \
    skill8 TEXT, \
    skill9 TEXT, \
    skill10 TEXT, \
    otherSkills TEXT, \
    jobExperienceTitle1 TEXT, \
    jobExperienceCompany1 TEXT, \
    jobExperienceYearStarted1 TEXT, \
    jobExperienceYearEnded1 TEXT, \
    jobExperienceTitle2 TEXT, \
    jobExperienceCompany2 TEXT, \
    jobExperienceYearStarted2 TEXT, \
    jobExperienceYearEnded2 TEXT, \
    jobExperienceTitle3 TEXT, \
    jobExperienceCompany3 TEXT, \
    jobExperienceYearStarted3 TEXT, \
    jobExperienceYearEnded3 TEXT, \
    jobExperience4Title TEXT, \
    jobExperienceCompany4 TEXT, \
    jobExperienceYearStarted4 TEXT, \
    jobExperienceYearEnded4 TEXT, \
    jobExperience5Title TEXT, \
    jobExperienceCompany5 TEXT, \
    jobExperienceYearStarted5 TEXT, \
    jobExperienceYearEnded5 TEXT, \
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
    referenceName1 TEXT, \
    referenceTitle1 TEXT, \
    referenceContactInfo1 TEXT, \
    referenceName2 TEXT, \
    referenceTitle2 TEXT, \
    referenceContactInfo2 TEXT, \
    referenceName3 TEXT, \
    referenceTitle3 TEXT, \
    referenceContactInfo3 TEXT, \
    phoneNumber TEXT, \
    emailAddress TEXT, \
    homeAddress TEXT, \
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
    jobExperienceYearStarted4,
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
    phoneNumber,
    emailAddress,
    homeAddress,
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
          jobExperienceYearStarted4,
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
          phoneNumber,
          emailAddress,
          homeAddress,
          raw_text
        ) VALUES (COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'), COALESCE(NULLIF(?, ''), 'N/A'))`,
        [
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
          jobExperienceYearStarted4,
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
          phoneNumber,
          emailAddress,
          homeAddress,
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
var configuration = new Configuration({
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
app.use("/assets", express.static("assets"));

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

// Handle requests for askRank
app.post("/askrank", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await askRank(prompt, openai);
    res.json(response);
  } catch (error) {
    console.error("Error processing Rank:", error);
    res.status(500).send("Failed to process Rank.");
  }
});

// Handle requests for getContactInfo
app.post("/getContactInfo", async (req, res) => {
  const { query } = req.body;
  try {
    console.log("Request received");
    const response = await getContactInfo(query);
    res.json({ data: response });
  } catch (error) {
    console.error("Error getting info:", error);
    res.status(500).send("Failed to process info.");
  }
});

// New API endpoint to handle file renaming
app.post("/renameFile", async (req, res) => {
  const { oldPath, newPath } = req.body;
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Error renaming file:", err);
      return res.status(500).send("Failed to rename file.");
    }
    res.send("File renamed successfully.");
  });
});

// Handle requests for CV summarization
app.post("/getContactSummary", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await getContactSummary(prompt, openai);
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: null },
  })
);

app.post("/initialize-api-key", (req, res) => {
  try {
    const apiKey = req.body.apiKey;

    if (!apiKey) {
      res.status(400).json({ error: "API key is required" });
      return;
    }

    req.session.apiKey = apiKey;
    res.status(200).json({ message: "API key initialized successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while initializing the API key" });
  }
});

app.get("/get-current-api-key", (req, res) => {
  try {
    const apiKey = req.session.apiKey;

    if (!apiKey) {
      res.status(404).json({ error: "API key not found" });
      return;
    }

    res.status(200).json({ apiKey: apiKey });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the API key" });
  }
});

app.post("/clear-api-key", (req, res) => {
  try {
    req.session.apiKey = null;
    res.status(200).json({ message: "API key cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while clearing the API key" });
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
