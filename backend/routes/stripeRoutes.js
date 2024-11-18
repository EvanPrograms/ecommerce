require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const router = require('express').Router()

const DOMAIN = 'http://localhost:5173'

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRICE_ID,
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${DOMAIN}/success.html`,
    cancle_url: `${DOMAIN}/cancel.html`
  })

  res.redirect(303, session.url)
})

module.exports = router