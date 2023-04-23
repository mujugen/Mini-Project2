var userDetails = Array.from([JSON.parse(localStorage.getItem("userDetails"))]);
document.getElementById("recipient").value = userDetails[0].name;

function sendEmail() {
  const recipient = document.getElementById("recipient").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const message = document.getElementById("message").value;

  const subject = `Interview Invite From ${company}`;
  const body = `Dear ${recipient},\n\n${message}\n\nSincerely,\n${company}`;

  const mailtoLink = `mailto:${email}?to=${recipient}&subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  window.open(mailtoLink, "_blank");
  window.location.href = "final-summary.html";
}
