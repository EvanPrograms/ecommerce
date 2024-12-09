const jwt = require('jsonwebtoken');
const { Cart } = require('../models'); 

const verifyCartOwnership = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; 

    const cart = await Cart.findOne({ where: { userId, id: req.body.cartItemId } });

    if (!cart) {
      return res.status(403).json({ message: 'You can only update your own cart' });
    }

    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyCartOwnership;
