const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.JWT_SECRET;
const user = { id: 1, email: 'testuser@testuser.com' };

// Generate a token
const token = jwt.sign(user, secret);
console.log('Generated Token:', token);

// Verify the token
try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded Token:', decoded);
} catch (error) {
  console.error('JWT Error:', error);
}
