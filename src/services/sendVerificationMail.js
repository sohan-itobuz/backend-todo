import mailSender from "../utils/mailSender.js";
import Otp from "../models/otpModel.js";

export async function sendVerificationMail(email, otpValue) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otpValue}</p>`
    );
    await Otp.findOneAndUpdate(
      { email },
      {
        $push: {
          otp: {
            otp: otpValue,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    )

    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
