import nodemailer from "nodemailer";
import { env } from "../config/envConfig";

export default async function mailSender(email, title, body) {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: env.MAIL_SENDER,
        pass: env.APP_PASSWORD,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: env.MAIL_SENDER,
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