import React, { useEffect, useContext, useRef } from "react";
import { useMutation } from "@apollo/client";
import { VALIDATE_SUCCESS } from "../../../graphql/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext, getDefaultCart } from '../../context/shop-context';

const Success = () => {
  const { randomValue } = useParams();
  const [validateSuccess] = useMutation(VALIDATE_SUCCESS);
  const { refetchCart, setCartItems, products, refetchProducts } = useContext(ShopContext);
  const navigate = useNavigate();
  const hasValidated = useRef(false);

  useEffect(() => {
    refetchProducts()
  }, [refetchProducts])

  useEffect(() => {
    const handleValidation = async () => {
      if (hasValidated.current) return; // Prevent multiple calls
      hasValidated.current = true;

      try {
        const response = await validateSuccess({ variables: { randomValue } });
        console.log("Validation successful and Cart cleared:", response.data.validateSuccess.success);
        setCartItems(getDefaultCart(products?.length))
        // Only refetch cart if the user is authenticated
        if (response.data.validateSuccess.userType !== "guest") {
          await refetchCart();
        } else {
          console.log("Guest checkout, no cart to refetch.");
        }
      } catch (error) {
        if (error.message.includes('Cannot read properties of undefined')) {
          console.error('Guest checkout with no user ID, treating as guest')
        } else {
          console.error("Validation Failed:", error);
          navigate("/not-found", { replace: true })
        }
        
      }
    };

    handleValidation();
  }, [randomValue, validateSuccess, refetchCart]);

  return (
    <div>
      <p>We appreciate your business! Thanks for your order</p>
    </div>
  );
};


export default Success;
