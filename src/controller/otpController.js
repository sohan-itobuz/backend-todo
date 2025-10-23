import otpGenerator from "otp-generator";
import Otp from "../models/otpModel.js";
import User from "../models/user.js";
import { sendVerificationMail } from "../services/sendVerificationMail.js";
import tokenGenerator from "../utils/tokenGenerator.js";
import { env } from "../config/envConfig.js";

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body

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
    // }
  } catch (error) {
    console.error(error)
    next(error);
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

    const accessToken = tokenGenerator.generateAccessToken({ email }, env.JWT_SECRET_KEY, env.JWT_EXPIRATION);

    return res.status(200).json({ success: true, message: 'OTP is valid.', accessToken })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during OTP verification.',
    })
  }
}