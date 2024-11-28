import React, { useContext} from "react";
import { ShopContext } from '../../context/shop-context'
import { useNavigate } from "react-router-dom";

const Product = (props) => {
  const { id, name, image, description, price, totalQuantityOrdered } = props.data
  const { addToCart, cartItems } = useContext(ShopContext)
  const cartItemAmount = cartItems[id]
  const navigate = useNavigate()

  const handleNavigateDetails = () => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="product" >
        <span onClick={handleNavigateDetails}>
          <img src={image} className="product-img"/>
          <div className="description">
            <p>
              <b>{name}</b>
            </p>
            <p>
              <b>Total Ordered: {totalQuantityOrdered}</b>
            </p>
            <p>{description}</p>
            <p>${price/100}</p>
          </div>
        </span>
        <button 
          className="addToCartBttn"
          onClick={() => addToCart(id)}
          >
          Add to Cart {cartItemAmount !== 0 && <>({cartItemAmount})</>}
        </button>
    </div>
  )
}

export default Product