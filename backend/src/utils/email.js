const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // REQUIRED for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify(); // 🔥 confirms SMTP works

  const info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject,
    text: message,
    html,
  });

  console.log('✅ Email sent:', info.messageId);
};

module.exports = sendEmail;
