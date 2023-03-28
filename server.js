const { CVSummarize } = require("./modules/CVSummarizer.js");
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

// Handle requests for CV summarization
app.post("/cvsummarize", async (req, res) => {
  const { pdfText } = req.body;
  try {
    const applicant = await CVSummarize(pdfText, openai);
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
