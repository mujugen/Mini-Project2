var userDetails = Array.from([JSON.parse(localStorage.getItem("userDetails"))]);
document.getElementById("name").value = userDetails[0].name;
