import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateAccessToken(userId, secretKey, expiresIn) {
    const accessToken = jwt.sign(userId, secretKey, { expiresIn });

    return accessToken;
  }

  static generateRefreshToken(userId, secretKey, expiresIn) {
    const refreshToken = jwt.sign(userId, secretKey, { expiresIn });
    return refreshToken;


  }
}