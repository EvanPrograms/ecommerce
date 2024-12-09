import React from "react";

const Checkout = () => (
  <div className="product">
    <h1>Checkout</h1>
    <form action="/create-checkout-session" method="POST">
      <button type="submit" id="checkout-button">Checkout</button>
    </form>
  </div>
);

export default Checkout;
