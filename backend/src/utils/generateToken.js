const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'amitsupersecretkey123';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

module.exports = generateToken;