function displayUploadedFiles() {
  console.log("Hello World");
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
}