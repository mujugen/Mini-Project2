// Function to convert PDF to text
function processPdf(blob) {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const typedArray = new Uint8Array(event.target.result);
      try {
        const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
        const numPages = pdfDoc.numPages;
        let rawText = "";

        for (let i = 1; i <= numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          rawText += textContent.items.map((item) => item.str).join(" ");
        }

        resolve({ text: rawText });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(blob);
  });
}
// End of processPdf

// Call CVSummarize API endpoint
async function fetchCVSummarize(pdfText) {
  const response = await fetch("http://localhost:3000/cvsummarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pdfText }),
  });
  const applicant = await response.json();
  return applicant;
}
// End of fetchCVSummarize

// Function for Convert to Text Button
async function convertUploadedFiles() {
  // Get the list of uploaded files from the server
  const response = await fetch("http://localhost:3000/list");
  const files = await response.json();

  for (const file of files) {
    const filePath = `uploads/${file}`;
    const name = file;

    try {
      const pdfBytes = await fetch(filePath).then((response) =>
        response.arrayBuffer()
      );
      const { x, text } = await processPdf(new Blob([pdfBytes]));
      console.log("PDF converted");
      const applicant = await fetchCVSummarize(text);
      const name = applicant.name;
      const education = applicant.education;
      const skills = applicant.skills;
      const experience = applicant.experience;
      const certifications = applicant.certification;
      const accomplishments = applicant.accomplishment;
      console.log(JSON.stringify(applicant));
      // Create an HTML container for the raw text
      const container = $(`
        <div class="pdf-container mt-4">
          <h3>${name}</h3>
          <div class="pdf-text"><b>Education:</b> ${education}</div>
          <div class="pdf-text"><b>Skills:</b> ${skills}</div>
          <div class="pdf-text"><b>Experience:</b> ${experience}</div>
          <div class="pdf-text"><b>Certifications:</b> ${certifications}</div>
          <div class="pdf-text"><b>Accomplishments:</b> ${accomplishments}</div>
        </div>
      `);

      // Append the container to the page
      $("#pdfContainers").append(container);
    } catch (error) {
      console.error(`Error processing file: ${file}`, error);
    }
  }
}

// Event listeners to load when document is ready
$(document).ready(function () {
  $("#uploadForm").on("submit", function (event) {
    event.preventDefault();

    // Check if any files are selected
    if ($("#fileInput").val() === "") {
      alert("Please choose at least one file.");
      return;
    }

    // Create a FormData object to hold the uploaded files data
    let formData = new FormData();
    let files = $("#fileInput")[0].files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // Send the uploaded files to the server
    $.ajax({
      url: "http://localhost:3000/upload",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function () {
        alert("Files uploaded successfully.");
      },
      error: function () {
        alert("Failed to upload files.");
      },
    });
  });
  // Event listener for convert button
  $("#convertBtn").on("click", function () {
    console.log("Convert button clicked");
    convertUploadedFiles();
  });
});
