// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  
  if (!token) {
    return res.status(403).json({ error: 'Token is required' });
  }
  
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  next();
};

module.exports = verifyToken;