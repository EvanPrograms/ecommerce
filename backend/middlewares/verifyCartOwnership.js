const jwt = require('jsonwebtoken');
const { Cart } = require('../models'); // Assuming Cart is a model for cart items

// Middleware to check if the user owns the cart
const verifyCartOwnership = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Decode the token to get user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // assuming token contains userId

    // Check if the cart belongs to the user
    const cart = await Cart.findOne({ where: { userId, id: req.body.cartItemId } });

    if (!cart) {
      return res.status(403).json({ message: 'You can only update your own cart' });
    }

    // Attach userId to request for later use in the controller
    req.userId = userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyCartOwnership;
