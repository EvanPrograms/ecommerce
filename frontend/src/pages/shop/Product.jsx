import React, { useContext, useEffect } from "react";
import { ShopContext } from '../../context/shop-context'
import { useNavigate } from "react-router-dom";
import './Product.css';

const Product = (props) => {
  const { 
      id, 
      name, 
      image, 
      description, 
      price, 
      totalQuantityOrdered, 
      averageRating, 
      reviewCount
    } = props.data
  const { addToCart, cartItems, refetchProducts } = useContext(ShopContext)
  const cartItemAmount = cartItems[id]
  const navigate = useNavigate()

  const handleNavigateDetails = () => {
    navigate(`/product/${id}`)
  }
  // console.log(cartItemAmount)

  const formatRating = (rating) => {
    const fullStars = Math.floor(rating); // Full stars (integer part)
    const halfStars = (rating % 1) >= 0.5 ? 1 : 0; // Half star if the decimal is >= 0.5
    const emptyStars = 5 - fullStars - halfStars; // Empty stars
    
    // Create an array with full, half, and empty stars
    const stars = [
      ...Array(fullStars).fill('⭐'),
      ...Array(halfStars).fill('✨'), // Use a different character for half star
      ...Array(emptyStars).fill('☆')
    ];
    
    return stars.join('');
  };

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
            {reviewCount === null || reviewCount === 0 ? (
              <p>
                <b>No reviews yet</b>
              </p>
            ) : (
              <p>
                <b>Rating: {formatRating(averageRating)}</b> <br />
                <b>{reviewCount} Review{reviewCount > 1 && "s"}!</b>
              </p>
            )}
            <p>{description}</p>
            <p>${price/100}</p>
          </div>
        </span>
        <button 
          className="addToCartBttn"
          onClick={() => addToCart(id)}
          >
          Add to Cart {cartItemAmount !== undefined && cartItemAmount !== 0 && <>({cartItemAmount})</>}
        </button>
    </div>
  )
}

export default Product