const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  // For production, use SendGrid, Mailgun, or AWS SES
  // For dev, we can use Ethereal or just log it if no creds

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL || process.env.EMAIL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || 'ethereal.pass',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Clothing Brand'} <${process.env.FROM_EMAIL || 'noreply@clothingbrand.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Add HTML support
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);

    // Log preview URL if using Ethereal
    if ((process.env.SMTP_HOST || 'smtp.ethereal.email').includes('ethereal.email')) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.log('Error sending email:', err);
    // Don't crash the request if email fails
  }
};

module.exports = sendEmail;
