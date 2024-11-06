const User = require('./user')
const Cart = require('./cart')
const Product = require('./product')

User.hasMany(Cart, { foreignKey: 'userId' })
Cart.belongsTo(User, { foreignKey: 'userId' })

Product.hasMany(Cart, { foreignKey: 'productId' })
Cart.belongsTo(Product, { foreignKey: 'productId' })

const syncModels = async () => {
  await User.sync();
  await Product.sync();
  await Cart.sync();
};

syncModels()

module.exports = {
  User,
  Cart,
  Product
}