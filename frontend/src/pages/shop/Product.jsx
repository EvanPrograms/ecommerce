import React, { useContext } from "react";
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

  const formatRating = (rating) => {
    const fullStars = Math.floor(rating); 
    const halfStars = (rating % 1) >= 0.5 ? 1 : 0; 
    const emptyStars = 5 - fullStars - halfStars; 
  
    const stars = [
      ...Array(fullStars).fill('⭐'),
      ...Array(halfStars).fill('✨'), 
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
  );
};

export default Product;