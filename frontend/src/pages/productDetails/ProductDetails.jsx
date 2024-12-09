import React, { useContext, useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/shop-context';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../../graphql/mutations';
import './ProductDetails.css'
import { AuthContext } from '../../context/auth-context';

const ProductDetails = () => {
  const { id } = useParams();
  const { state } = useLocation()
  const { products, addToCart, cartItems, userReviews, submitReview, refetchProducts } = useContext(ShopContext)
  const cartItemAmount = cartItems[id]
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(state?.openReviewForm || false)
  const [stars, setStars] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const { user } = useContext(AuthContext)

  const { data: reviewsData, loading: reviewsLoading, refetch } = useQuery(GET_REVIEWS, {
    variables: { productId: id }, // Pass productId to the query
    fetchPolicy: 'network-only', // Ensure fresh data
  });

  const [localReviews, setLocalReviews] = useState(reviewsData?.getReviews || []);

  useEffect(() => {
    if (reviewsData?.getReviews) {
      setLocalReviews(reviewsData.getReviews);
    }
  }, [reviewsData]);

  const product = products.find((product) => product.id === id)
  const existingReview = user ? localReviews.find((review) => review.userId === user.id) : null;

  if (!products) {
    return <h2>Loading...</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  


  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const reviewData = {
      productId: product.id,
      review: reviewText,
      stars,
    };
  
    try {
      const { data } = await submitReview(reviewData);
      setIsReviewFormOpen(false);
      setLocalReviews((prevReviews) => [...prevReviews, data.createReview]);
      await refetch(); // Refresh reviews
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };
  

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
          <p className="product-rating">Rating: {formatRating(product.averageRating)}</p>
          <p className="product-total-ordered">{product.totalQuantityOrdered} bought by Happy People!</p>
          <button className="add-to-cart-button" onClick={() => addToCart(id)}>Add to Cart {cartItemAmount !== undefined && cartItemAmount !== 0 && <>({cartItemAmount})</>}</button>
        </div>
      </div>
      <div className="review-title">
        {user && existingReview ? (
          <div className="your-review">
            <h3>Your Review:</h3>
            <p>Rating: {formatRating(existingReview.stars)}</p>
            <p>{existingReview.review}</p>
          </div>
        ) : (
          user && !isReviewFormOpen && (
            <button 
              className="leave-review-button"
              onClick={() => setIsReviewFormOpen(true)}
            >
              Leave Review
            </button>
          )
        )}
        {user && isReviewFormOpen && (
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
        {!user && <p className="no-review-message">Please log in to leave a review!</p>}
      </div>
      <div>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : (
          reviewsData?.getReviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{formatRating(review.stars)}:</strong> {review.review}</p>
              <p><em>Posted on {new Date(review.createdAt).toLocaleDateString()}</em></p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductDetails;