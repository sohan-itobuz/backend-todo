import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateAccessToken(userId, secretKey, expiresIn) {
    return jwt.sign({ userId }, secretKey, { expiresIn });
  }

  static generateRefreshToken(userId, secretKey, expiresIn) {
    return jwt.sign({ userId }, secretKey, { expiresIn });
  }
}