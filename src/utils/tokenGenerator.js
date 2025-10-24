import jwt from 'jsonwebtoken';

export default class TokenGenerator {
  static generateAccessToken(userId, secretKey, expiresIn) {
    const access_token = jwt.sign(userId, secretKey, { expiresIn });

    return access_token;
  }

  static generateRefreshToken(userId, secretKey, expiresIn) {
    const refresh_token = jwt.sign(userId, secretKey, { expiresIn });

    return refresh_token;
  }
}