import { createContext, useState, useEffect, useContext } from 'react'
// import PRODUCTS from '../products'
import { useQuery, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { AuthContext } from './auth-context'
import { useApolloClient } from '@apollo/client'
import { 
  GET_USER_CART,
  UPDATE_USER_CART,
  GET_PRODUCTS,
  CREATE_REVIEW
} from '../../graphql/mutations'

export const ShopContext = createContext(null)

export const getDefaultCart = (productsLength) => {
  let cart = {}
  for (let i = 1; i < productsLength + 1; i++) {
    cart[i] = 0
  }
  return cart
}

const useCartUpdate = (mutation) => {
  const { user } = useContext(AuthContext);
  const updateCart = (newCart) => {
    if (user?.id) {
      const cart = Object.keys(newCart).map(productId => ({
        productId,
        quantity: newCart[productId],
      }));
      mutation.mutate({ userId: user.id, cart });
    }
  };
  return updateCart;
};

export const ShopContextProvider = (props) => {
  const { user } = useContext(AuthContext)
  const client = useApolloClient()

  const [userReviews, setUserReviews] = useState([])

  const { data: products, error, isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => client
      .query({
        query: GET_PRODUCTS,
        fetchPolicy: 'network-only'
      })
      .then(response => response.data.getProducts)
  })

  const [cartItems, setCartItems] = useState(getDefaultCart(products?.length))

  useEffect(() => {
    if (products) {
      setCartItems(getDefaultCart(products.length));
    }
  }, [products]);

  const { data: userCartData } = useQuery({
    queryKey: ['carts', user?.id],
    queryFn: () => client.query({
      query: GET_USER_CART,
      variables: { userId: user.id }
    })
    .then(response => 
      response.data.getUserCart.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {}),
    ),
    enabled: !!user
  });

  useEffect(() => {
    if (userCartData) {
      setCartItems(prev => ({...prev, ...userCartData }))
    }
  }, [userCartData])

  useEffect(() => {
    if (!user) {
      // Reset the cart when user logs out
      setCartItems(getDefaultCart(products?.length));
    }
  }, [user, products]);

  const mutation = useMutation({
    mutationFn: ({ userId, cart }) => client.mutate({
      mutation: UPDATE_USER_CART,
      variables: { userId, cart }
    }),
    onSuccess: () => {
      console.log("Cart updated successfully")
    },
    onError: (error) => {
      console.error('Error updating cart:', error)
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(err => console.log(err.message));
      }
    }
  })

  const updateCart = useCartUpdate(mutation);

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      if (quantity > 0) {
        const product = products.find(product => product.id === itemId);
        total += quantity * Number(product.price);
      }
      return total;
    }, 0);
  };

  const handleCartChange = (itemId, change) => {
    setCartItems(prev => {
      const newQuantity = (prev[itemId] || 0) + change; // Ensure no NaN
      const newCart = { ...prev, [itemId]: Math.max(newQuantity, 0) };
      updateCart(newCart);
      return newCart;
    });
  };

  const refetchCart = async () => {
    if (user?.id) {
      try {
        const { data } = await client.query({
          query: GET_USER_CART,
          variables: { userId: user.id },
          fetchPolicy: "network-only", // Ensures fresh data is fetched
        });
  
        const newCart = data.getUserCart.reduce((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {});
  
        // Reset to getDefaultCart if the cart is empty
        setCartItems(Object.keys(newCart).length > 0 ? newCart : getDefaultCart(products?.length || 0));
      } catch (error) {
        console.error("Error refetching cart:", error);
        // On error, reset to getDefaultCart
        setCartItems(getDefaultCart(products?.length || 0));
      }
    } else {
      // Reset to getDefaultCart for non-authenticated users
      setCartItems(getDefaultCart(products?.length || 0));
    }
  };

  const refetchProducts = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching products:", error);
    }
  };

  const reviewMutation = useMutation({
    mutationFn: ({ productId, review, stars }) =>
      client.mutate({
        mutation: CREATE_REVIEW,
        variables: { productId, review, stars}
      }),
    onSuccess: (newReview) => {
      setUserReviews((prevReviews) => [...prevReviews, newReview.data.createReview])
      refetchProducts()
    },
    onError: (error) => {
      console.error('Error submitting review: ', error)
    }
  })

  const submitReview = (reviewData) => {
    if (!user?.id) {
      console.error('User is not logged in')
      return
    }
    reviewMutation.mutate(reviewData)
  }

  const contextValue = { 
    cartItems, 
    addToCart: (itemId) => handleCartChange(itemId, 1),
    removeFromCart: (itemId) => handleCartChange(itemId, -1),
    clearTheCart: (itemId) => handleCartChange(itemId, -cartItems[itemId]),
    updateCartItemCount: (newAmount, itemId) => handleCartChange(itemId, newAmount - cartItems[itemId]),
    getTotalCartAmount,
    refetchCart,
    refetchProducts: refetch,
    setCartItems,
    userReviews,
    submitReview,
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
 