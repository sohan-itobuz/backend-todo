import jsonwebtoken from "jsonwebtoken"

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jsonwebtoken.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
    //eslint-disable-next-line
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
export default verifyToken;