let nameS = (emailS = messageS = "");
let contactData = document.querySelector(".contactData");

function sendEmail() {
  let parms = {
    name: document.getElementById("senderName").value,
    email: document.getElementById("senderEmail").value,
    message: document.getElementById("senderMessage").value,
    subject: document.getElementById("senderName").value,
  };

  emailjs
    .send("service_68h985w", "template_1m1b44q", parms) // Ensure to use the correct template ID
    .then(function (response) {
      console.log("Email sent successfully:", response);
      alert("Email Sent Successfully!");
    })
    .catch(function (error) {
      console.error("Email sending failed:", error);
      alert("Error sending email. Please try again.");
    });
}
let submitBtn = document.querySelector(".submitBtn");

submitBtn.addEventListener("click", function () {
  sendEmail();

  // Clear input values after sending email
  document.getElementById("senderName").value = "";
  document.getElementById("senderEmail").value = "";
  document.getElementById("senderMessage").value = "";
});
