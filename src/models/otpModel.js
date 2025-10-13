import mongoose from "mongoose";
import { sendVerificationMail } from "../services/sendVerificationMail.js";



const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: 300 },
    // expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationMail(this.email, this.otp);
  }
  next();
});

const otp = mongoose.model('otp', otpSchema);
export default otp;
