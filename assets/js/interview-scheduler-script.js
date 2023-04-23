var userDetails = Array.from([JSON.parse(localStorage.getItem("userDetails"))]);

var address = document.getElementById("company_address").value;
var phone_number = document.getElementById("phone_number").value;
var email = document.getElementById("email").value;
var company = document.getElementById("company").value;
var subject = `Interview Invite From ${company}`;
var body = "";

function updateTextArea() {
  address = document.getElementById("company_address").value;
  phone_number = document.getElementById("phone_number").value;
  email = document.getElementById("email").value;
  company = document.getElementById("company").value;
  subject = `Interview Invite From ${company}`;
  textarea = document.getElementById("message");
  textarea.value = `Dear ${userDetails[0].name},
  
  We are pleased to inform you that you have been accepted for an interview. We would like to invite you for an interview on ${userDetails[0].date} at ${userDetails[0].time} at our office located at ${address}.
  
  During the interview, we will discuss your experience and qualifications, as well as the role and responsibilities of the position you have applied for. We encourage you to come prepared with any questions or concerns you may have.
  
  Please confirm your availability for the scheduled interview by replying to this email or by calling us at ${phone_number} at your earliest convenience.
  
  Thank you for your interest in our company, and we look forward to meeting you soon.
  
  Best regards,
  
  ${company}`;
  body = textarea;
}

function sendEmail() {
  const mailtoLink = `mailto:${email}?to=&subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body.value)}`;

  window.open(mailtoLink, "_blank");
  window.location.href = "final-summary.html";
}

const inputs = document.querySelectorAll(
  "input[type='text'], input[type='email'], textarea"
);
inputs.forEach((input) => {
  input.addEventListener("input", updateTextArea);
});

updateTextArea();
