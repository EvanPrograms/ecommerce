import { createContext, useState, useEffect } from 'react'
// import PRODUCTS from '../products'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const ShopContext = createContext(null)

const getDefaultCart = (productsLength) => {
  let cart = {}
  for (let i = 1; i < productsLength + 1; i++) {
    cart[i] = 0
  }
  return cart
}

export const ShopContextProvider = (props) => {
  const { data: products, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => axios.get('http://localhost:5000/api/products').then(res => res.data)
  })

  // console.log('this is query', data)

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {error.message}</div>

  const [cartItems, setCartItems] = useState(getDefaultCart(products?.length))

  useEffect(() => {
    if (products) {
      setCartItems(getDefaultCart(products.length));
    }
  }, [products]);

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = products.find((product) => product.id === Number(item))
        totalAmount += cartItems[item] * itemInfo.price
      }
    }
    return totalAmount
  }

  const addToCart = (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId] + 1}))
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId] - 1}))
  }

  const clearTheCart = (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: 0 }))
  }

  const updateCartItemCount = (newAmount, itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: newAmount}))
  }

  const contextValue = { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    clearTheCart, 
    updateCartItemCount,
    getTotalCartAmount,
    products
   }

  // console.log(cartItems)
  // console.log('Current Cart Items:', cartItems);

  return (
    <ShopContext.Provider value={contextValue}>
      {isLoading ? <div>Loading...</div> : error ? <div>Error: {error.message}</div> : props.children}
    </ShopContext.Provider>
  )
}

