import React from "react";

const Checkout = () => {
  return(
    <div className="product">
      <h1>checkout</h1>
      <form action="/create-checkout-session" method="POST">
        <button type="submit" id="checkout-button">Checkout</button>
      </form>
    </div>
  )
}

export default Checkout
