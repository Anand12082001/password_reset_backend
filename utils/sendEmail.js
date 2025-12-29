import nodemailer from "nodemailer";

const sendEmail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `<p>Click below to reset password:</p>
           <a href="${link}">${link}</a>`
  });
};

export default sendEmail;
