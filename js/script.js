$(document).ready(function () {
  $("#uploadForm").on("submit", function (event) {
    event.preventDefault();

    // Check if a file is selected
    if ($("#fileInput").val() === "") {
      alert("Please choose a file.");
      return;
    }

    // Create a FormData object to hold the uploaded file data
    let formData = new FormData();
    formData.append("file", $("#fileInput")[0].files[0]);

    // Send the uploaded file to the server
    $.ajax({
      url: "/upload", // Replace with your server-side upload URL
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function () {
        alert("File uploaded successfully.");
      },
      error: function () {
        alert("Failed to upload file.");
      },
    });
  });
});
