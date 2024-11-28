import React, { useContext, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/shop-context';
import './ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation()
  const { products, addToCart, cartItems, userReviews, submitReview } = useContext(ShopContext)
  const cartItemAmount = cartItems[id]
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(state?.openReviewForm || false)
  const [stars, setStars] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const product = products.find((product) => product.id === id)
  const existingReview = userReviews?.find((review) => review.productId === id)

  if (!products) {
    return <h2>Loading...</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  const handleSubmitReview = (event) => {
    event.preventDefault()
    const reviewData = {
      productId: product.id,
      review: reviewText,
      stars
    }
    submitReview(reviewData)
    setIsReviewFormOpen(false)
    console.log('Submitting Review: ', reviewData)
    
  }

  const renderStarsDropdown = () => (
    <select
      id="stars"
      name="stars"
      value={stars}
      onChange={(e) => setStars(Number(e.target.value))}
      required
    >
      <option value={0}>0 - No stars</option>
      <option value={1}>1 - ⭐</option>
      <option value={2}>2 - ⭐⭐</option>
      <option value={3}>3 - ⭐⭐⭐</option>
      <option value={4}>4 - ⭐⭐⭐⭐</option>
      <option value={5}>5 - ⭐⭐⭐⭐⭐</option>
    </select>
  );

  return(
    <div>
      <div className="product-details">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${(product.price / 100).toFixed(2)}</p>
          <p className="product-total-ordered">{product.totalQuantityOrdered} bought by Happy People!</p>
          <button className="add-to-cart-button" onClick={() => addToCart(id)}>Add to Cart {cartItemAmount !== 0 && <>({cartItemAmount})</>}</button>
        </div>
      </div>
      <div>
        {existingReview ? (
          <div>
            <h3>Your Review:</h3>
            <p>Rating: {existingReview.stars} / 5</p>
            <p>{existingReview.review}</p>
          </div>
        ) : (
          <>
            {!isReviewFormOpen && (
              <button onClick={() => setIsReviewFormOpen(true)}>Leave Review</button>
            )}
            {isReviewFormOpen && (
              <form onSubmit={handleSubmitReview}>
                <h3>Leave a Review</h3>
                <textarea
                  name="review"
                  placeholder="Write your review here"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                ></textarea>
                <div>
                  <label>Rating:</label>
                  {renderStarsDropdown()}
                </div>
                <button type="submit">Submit Review</button>
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetails;