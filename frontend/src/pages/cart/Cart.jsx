import React, { useContext } from "react"
import { ShopContext } from "../../context/shop-context"
import Product from '../shop/Product'
import CartItem from "./CartItem"
import "./cart.css"
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client';import axios from "axios"
import { CREATE_CHECKOUT_SESSION } from '../../../graphql/mutations'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, getTotalCartAmount, products } = useContext(ShopContext)
  const totalAmount = getTotalCartAmount()

  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION)

  const handleCheckout = async () => {
    const cartDetails = products
      .filter(product => cartItems[product.id] > 0)
      .map(product => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: cartItems[product.id]
      }))

      try {
        const { data } = await createCheckoutSession({
          variables: { cartItems: cartDetails }
        })
        if (data?.createCheckoutSession?.url) {
          window.location.href = data.createCheckoutSession.url
        }
      } catch (error) {
        console.error('Checkout session creation failed: ', error)
      }
  }

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cartItems">
        {products?.length > 0 ? (
          products.map((product) => {
            const productQuantity = cartItems[product.id] || 0;
            if (productQuantity > 0) {
              return <CartItem key={product.id} data={product} />;
            }
            return null;
          })
        ) : (
          <div>Loading products...</div>
        )}
      </div>
      {totalAmount > 0 ? (
        <div className="checkout">
          <p> Subtotal: ${(totalAmount/100).toFixed(2)}</p>
          <p>!Use Credit Card Number "4242 4242 4242 4242" for Testing a 'valid' Credit Card!</p>
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
  )
}

export default Cart