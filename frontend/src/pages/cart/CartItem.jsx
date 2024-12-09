import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { useNavigate } from "react-router-dom";

const CartItem = (props) => {
  const { 
    addToCart, 
    removeFromCart, 
    clearTheCart, 
    cartItems, 
    updateCartItemCount
   } = useContext(ShopContext);
   const navigate = useNavigate();

  const { id, name, image, price} = props.data;
  const [inputValue, setInputValue] = useState(cartItems[id] || 0);

  const handleChange = (event) => {
    const value = event.target.value;

    if (value === '' || /^\d+$/.test(value) && value.length <= 3) {
      setInputValue(value);
      if (value !== '') {
        updateCartItemCount(Number(value), id);
      }
    }
  };

  const handleDivClick = (e) => {
    if (
      e.target.tagName !== "BUTTON" && 
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "IMG"
    ) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div 
    className="cartItem" 
    onClick={handleDivClick} 
    style={{ cursor: 'pointer' }}
    >
      <img src={image} alt={`${name}`}/>
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>Item total ${((Number(price) * cartItems[id])/100).toFixed(2)}</p>
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
  );
};

export default CartItem;