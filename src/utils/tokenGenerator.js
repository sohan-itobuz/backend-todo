import jwt from 'jsonwebtoken';
// import { LocalStorage } from 'node-localstorage';
// const localStorage = new LocalStorage('./scratch');

export default class tokenGenerator {
  static generateAccessToken(userId, secretKey, expiresIn) {
    const accessToken = jwt.sign({ userId }, secretKey, { expiresIn });
    // localStorage.setItem('accessToken', JSON.stringify(accessToken));
    return accessToken;
  }

  static generateRefreshToken(userId, secretKey, expiresIn) {
    const refreshToken = jwt.sign({ userId }, secretKey, { expiresIn });
    // localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
    return refreshToken;


  }
}