import React, { useContext} from "react"
import PRODUCTS from '../../products'
import { ShopContext } from "../../context/shop-context"
import Product from '../shop/Product'
import CartItem from "./CartItem"
import "./cart.css"
import { useNavigate } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, getTotalCartAmount, products } = useContext(ShopContext)
  const totalAmount = getTotalCartAmount()

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
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      ) : (
        <h1>Your Shopping Cart is Empty</h1>
      )}
    </div>
  )
}

export default Cart