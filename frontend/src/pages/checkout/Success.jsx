import React, { useEffect, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CLEAR_CART, VALIDATE_SUCCESS, GET_USER_CART } from "../../../graphql/mutations";
import { useParams } from "react-router-dom";
import { ShopContext } from '../../context/shop-context'


const Success = () => {
  const { randomValue } = useParams()
  const [validateSuccess] = useMutation(VALIDATE_SUCCESS)
  const { refetchCart, cartItems } = useContext(ShopContext)

  useEffect(() => {
    const handleValidation = async () => {
      try {
        const response = await validateSuccess({ variables: { randomValue } })
        console.log("Validation successful and Cart cleared:", response.data.validateSuccess.success);
        await refetchCart()
        console.log('Cart items after refetch:', cartItems);
      } catch(error) {
        console.error('Error clearing cart: ', error)
      }
    }

    handleValidation()
  }, [randomValue, validateSuccess, refetchCart])

  return(
    <div>
      <p>
        We appreciate your business! Thanks for your order
      </p>
    </div>
  )
}

export default Success