import getStripe from '../../../lib/getStripe';

const DOMAIN = process.env.REACT_APP_DOMAIN || 'http://localhost:5173';

export default function Home () {
  async function handleCheckout() {
    const stripe = await getStripe();

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: process.env.REACT_APP_STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/success.html`,
      cancel_url: `${DOMAIN}/cancel.html`
    });

    if (error) {
      console.warn(error.message);
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}