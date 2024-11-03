import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/shop-context";

const CartItem = (props) => {
  const { 
    addToCart, 
    removeFromCart, 
    clearTheCart, 
    cartItems, 
    updateCartItemCount
   } = useContext(ShopContext)

  const { id, name, image, description, price} = props.data
  const [inputValue, setInputValue] = useState(cartItems[id] || 0);

  const handleChange = (event) => {
    const value = event.target.value;

    // Check if the input is a valid number or empty
    if (value === '' || /^\d+$/.test(value) && value.length <= 3) {
      setInputValue(value); // Update local state
      if (value !== '') {
        updateCartItemCount(Number(value), id); // Update context state only with a valid number
      }
    }
  };

  return (
    <div className="cartItem">
      <img src={image} />
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Item total ${((price * cartItems[id])/100).toFixed(2)}</p>
        <div className="countHandler">
          <button onClick={() => removeFromCart(id)}> - </button> 
          <input 
            style={{ width: '60px'}}
            type="number"
            value={cartItems[id]} 
            onChange={handleChange}
            />
          <button onClick={() => addToCart(id)}> + </button>
          <button onClick={() => clearTheCart(id)}> Remove from Cart </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem