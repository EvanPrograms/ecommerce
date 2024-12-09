const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const Order = require('../models/order');

const STRIPE_KEY = process.env.STRIPE_KEY;
const endpointSecret = process.env.WEBHOOK_SECRET;

const stripe = require('stripe')(STRIPE_KEY);

router.get('/', async (request, response) => {
  response.send('testing get');
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
        const userId = session.metadata.userId;
        const cartItems = JSON.parse(session.metadata.cartItems); 
        const totalPrice = session.amount_total;
        const shippingAddress = session.shipping_details?.address;

        await Order.create({
          userId: userId ? parseInt(userId, 10) : null, 
          items: cartItems,
          totalPrice,
          shippingAddress: shippingAddress
            ? JSON.stringify(shippingAddress)
            : null,
          orderDate: new Date(),
          sessionId: session.id,
        });

        console.log('Order created for session:', session.id);
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
