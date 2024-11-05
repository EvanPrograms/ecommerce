import React, { useContext} from "react";
import { ShopContext } from '../../context/shop-context'

const Product = (props) => {
  const { id, name, image, description, price } = props.data
  const { addToCart, cartItems } = useContext(ShopContext)
  const cartItemAmount = cartItems[id]

  return (
    <div className="product">
      <img src={image} className="product-img"/>
      <div className="description">
        <p>
          <b>{name}</b>
        </p>
        <p>{description}</p>
        <p>${price/100}</p>
        <button 
          className="addToCartBttn"
          onClick={() => addToCart(id)}
          >
          Add to Cart {cartItemAmount !== 0 && <>({cartItemAmount})</>}
        </button>
      </div>
    </div>
  )
}

export default Product