import mongoose from "mongoose";
import { sendVerificationMail } from "../services/sendVerificationMail.js";


const otpSubSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiryOTP: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      // expires: 0,
    },
  },
  { _id: false }
)


const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: [otpSubSchema],
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
