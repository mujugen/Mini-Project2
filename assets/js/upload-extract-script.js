function displayUploadedFiles() {
  // Check if any files are selected
  if ($("#fileInput").val() === "") {
    alert("Please choose at least one file.");
    return;
  }

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
    processData: false,
    contentType: false,
    success: function (response) {
      for (let i = 0; i < files.length; i++) {
        // Add a new row for each uploaded file
        addUploadedFile(files[i].name, files[i].size);
      }
    },
    error: function () {
      alert("Failed to upload files.");
    },
  });
}

function addUploadedFile(fileName, fileSize) {
  const formattedSize = (fileSize / (1024 * 1024)).toFixed(2) + " MB";
  const currentDate = new Date().toLocaleDateString("en-GB");

  const newRow = `<tr>
    <td>
      <div class="table-img">
        <i class="fa-solid fa-file-pdf fa-xl"></i>
      </div>
    </td>
    <td>
      <label>${fileName}</label>
    </td>
    <td>
      <label>${currentDate}</label>
    </td>
    <td>
      <label>${formattedSize}</label>
    </td>
  </tr>`;

  $("#rawPDFContainer").append(newRow);
}


async function extractRawText(){
  
}