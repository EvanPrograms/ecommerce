import React from 'react';
import './Order.css';
import { useNavigate } from 'react-router-dom';

const Order = ({ orders }) => {
  const navigate = useNavigate()
  if (orders.length === 0) {
    return <div className="no-orders">No order history found.</div>;
  }

  return (
    <div className="order-container">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3 className="order-date">
            Order Date: {new Date(order.orderDate).toLocaleDateString()}
          </h3>
          <p className="total-price">Total Price: ${order.totalPrice / 100}</p>
          <h4 className="section-title">Items:</h4>
          <ul className="items-list">
            {order.items.map((item, index) => (
              <li key={index} className="item">
                <span className="item-name">
                  {item.quantity} x{' '} 
                    <span
                      className='clickable-item'
                      onClick={() => navigate(`/product/${item.productId}`)}>
                       {item.name}
                    </span>
                     (${item.price / 100} each)
                  {!item.hasLeftReview ? (
                    <button onClick={() => navigate(`/product/${item.productId}`, { state: { openReviewForm: true }})}>
                      Leave Review
                    </button>
                  ) : (
                    <span> Product Reviewed</span>
                  )}
                </span>
                <span className="item-price">Item total ${item.price * item.quantity / 100}</span>
              </li>
            ))}
          </ul>
          <h4 className="section-title">Shipping Address:</h4>
          <p className="shipping-address">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postal_code}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Order;
