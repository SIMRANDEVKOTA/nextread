const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Allow "OPTIONS" method (Browser pre-check) to pass without token
  if (req.method === 'OPTIONS') {
    return next();
  }

  // 2. Get the header (Handles 'Authorization' and 'authorization')
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // 3. Remove "Bearer " if present, otherwise take the whole string
    const token = authHeader.replace("Bearer ", "").trim();

    // 4. Verify
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = verified;
    next();

  } catch (err) {
    console.error("❌ Token Verification Error:", err.message);
    res.status(403).json({ message: 'Invalid Token' });
  }
};