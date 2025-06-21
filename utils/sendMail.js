const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transport instance for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // your Gmail address
    pass: process.env.MAIL_PASS, // your Gmail password or app password
  },
});

// sendMail function to send emails
const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_USER, // sender email
    to, // recipient email
    subject, // email subject
    text, // email body text
  };

  try {
    console.log(`Sending email to ${to} with subject: ${subject}`);
    // Send the email and wait for the response
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Detailed Error:', error);
    throw new Error('Failed to send email');
  }
};

// Export the sendMail function for use in other parts of the application
module.exports = sendMail;
