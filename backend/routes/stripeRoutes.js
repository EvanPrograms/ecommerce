const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const Order = require('../models/order')
const Cart = require('../models/cart')

const STRIPE_KEY = process.env.STRIPE_KEY
const endpointSecret = process.env.WEBHOOK_SECRET

const stripe = require('stripe')(STRIPE_KEY)

router.get('/', async (request, response) => {
  response.send('testing get')
})

router.post('/', bodyParser.raw({ type: 'application/json '}), async (request, response) => {
  const signature = request.headers['stripe-signature'];

  if (!endpointSecret) {
    console.error('Missing webhook secret in environment variables');
    return response.status(500).send('Webhook secret not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      endpointSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Checkout session completed:', session);

      try {
        // Extract data from session
        const userId = session.metadata.userId; // Assuming `userId` is passed in metadata
        const cartItems = JSON.parse(session.metadata.cartItems); // Assuming `cartItems` is stored in metadata
        const totalPrice = session.amount_total; // Total price from Stripe session
        const shippingAddress = session.shipping_details?.address;

        // Create the order in your database
        await Order.create({
          userId: userId ? parseInt(userId, 10) : null, // Parse userId if it's provided
          items: cartItems, // Use parsed cart items
          totalPrice,
          shippingAddress: shippingAddress
            ? JSON.stringify(shippingAddress)
            : null, // Convert address to string if exists
          orderDate: new Date(),
          sessionId: session.id,
        });

        console.log('Order created for session:', session.id);

        if (userId) {
          // Authenticated user - reset their cart
          await Cart.destroy({ where: { userId: parseInt(userId, 10) } });
        } else {
          // Guest user - reset cart for guest (identified by null userId)
          await Cart.destroy({ where: { userId: null } });
        }

      } catch (error) {
        console.error('Error creating order:', error.message);
      }
    }

    response.status(200).send('Webhook handled successfully');
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
