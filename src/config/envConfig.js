import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  MAIL_SENDER: process.env.MAIL_SENDER,
  APP_PASSWORD: process.env.APP_PASSWORD,
}