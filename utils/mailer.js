const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Account = require('../models/Account');

dotenv.config();

// Update the sendEmail function to accept an additional 'additionalRecipient' parameter
const sendEmail = async (accountId, subject, text, additionalRecipient) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,  // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Find the account to get the registered email address
    const account = await Account.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Prepare the recipient list: account's email and the additional recipient
    const recipients = [account.email];
    if (additionalRecipient) {
      recipients.push(additionalRecipient);
    }

    // Send the email to both the registered account and the provided email address
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: recipients.join(','),  // Combining both emails
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully to:", recipients.join(', '));
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
