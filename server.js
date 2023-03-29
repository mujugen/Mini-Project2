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
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, education TEXT, skills TEXT, experience TEXT, certifications TEXT, accomplishments TEXT, raw_text TEXT)"
);

function insertUser(userData) {
  const {
    name,
    education,
    skills,
    experience,
    certifications,
    accomplishments,
    raw_text,
  } = userData;

  db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      console.log(`User ${name} already exists with ID: ${row.id}`);
    } else {
      db.run(
        `INSERT INTO users (name, education, skills, experience, certifications, accomplishments, raw_text) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          education,
          skills,
          experience,
          certifications,
          accomplishments,
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
  const { rawText, filters } = req.body;
  try {
    /* console.log(req);
    console.log(rawText);
    console.log(filters); */
    console.log("Request received in /redFlagRemover");
    const redFlagAnalysis = await redFlagRemover(rawText, openai, filters);
    res.json(redFlagAnalysis);
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("Failed");
  }
});

// Handle requests for CV summarization
app.post("/cvsummarize", async (req, res) => {
  const { pdfText } = req.body;
  try {
    const applicant = await CVSummarize(pdfText, openai);
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
