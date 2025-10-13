import otpGenerator from "otp-generator";
import Otp from "../models/otpModel.js";
import User from "../models/user.js";

export async function sendOTP(req, res) {
  try {
    const { email } = req.body;
    // Check if user is already present
    // console.log(email);
    const checkUserVerified = await User.findOne({ email });
    // console.log(checkUserVerified ? true : false);

    if (checkUserVerified) {
      res.status(401).json({
        success: false,
        message: 'User is already verified',
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await Otp.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await Otp.findOne({ otp });
    }

    const otpPayload = { email, otp };
    // const otpBody = 
    await Otp.create(otpPayload);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};