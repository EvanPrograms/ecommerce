const User = require('./user')
const Cart = require('./cart')
const Product = require('./product')
const CheckoutSession = require('./checkoutSession')

User.hasMany(Cart, { foreignKey: 'userId' })
Cart.belongsTo(User, { foreignKey: 'userId' })

Product.hasMany(Cart, { foreignKey: 'productId' })
Cart.belongsTo(Product, { foreignKey: 'productId' })

User.hasMany(CheckoutSession, { foreignKey: 'productId'})
CheckoutSession.belongsTo(User, { foreignKey: 'userId'})

const syncModels = async () => {
  await User.sync();
  await Product.sync();
  await Cart.sync();
  await CheckoutSession.sync()
};

syncModels()

module.exports = {
  User,
  Cart,
  Product,
  CheckoutSession
}