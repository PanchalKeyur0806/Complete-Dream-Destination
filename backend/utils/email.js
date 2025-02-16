const { text } = require("express");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transpoter
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Dream Destination dreamdestination@gmail.com`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(`Error sending Emial : ${err}`);
  }
};

module.exports = sendEmail;
