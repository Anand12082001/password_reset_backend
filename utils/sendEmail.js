const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL, // MUST match .env
      subject,
      html,
    });

    console.log("✅ Email sent via SendGrid API");
  } catch (error) {
    console.error(
      "❌ SendGrid API error:",
      error.response?.body || error.message
    );
    throw error;
  }
};

module.exports = sendEmail;
