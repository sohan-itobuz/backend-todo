import otpGenerator from "otp-generator";
import Otp from "../models/otpModel.js";
import User from "../models/user.js";
import { sendVerificationMail } from "../services/sendVerificationMail.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const userExists = await User.findOne({ email })
    if (userExists.verified) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered and verified',
      })
    } else {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })

      await sendVerificationMail(email, otp);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
}


export async function verifyOTP(req, res) {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and OTP are required.' })
  }

  try {
    const userOTPEntry = await Otp.findOne({ email })

    if (!userOTPEntry || userOTPEntry.otp.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No OTP found for this email.' })
    }

    const latestOTP = userOTPEntry.otp[userOTPEntry.otp.length - 1]

    if (latestOTP.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP.' })
    }

    if (new Date() > new Date(latestOTP.expiryOTP)) {
      return res
        .status(410)
        .json({ success: false, message: 'OTP has expired.' })
    }
    await User.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    )

    return res.status(200).json({ success: true, message: 'OTP is valid.' })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during OTP verification.',
    })
  }
}