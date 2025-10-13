import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function mailSender(email, title, body) {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.APP_PASSWORD,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};