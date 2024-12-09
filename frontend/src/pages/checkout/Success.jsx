import React, { useEffect, useContext, useRef } from "react";
import { useMutation } from "@apollo/client";
import { VALIDATE_SUCCESS } from "../../../graphql/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext, getDefaultCart } from '../../context/shop-context';
import './success.css'; // Import your CSS here

const Success = () => {
  const { randomValue } = useParams();
  const [validateSuccess] = useMutation(VALIDATE_SUCCESS);
  const { refetchCart, setCartItems, products, refetchProducts } = useContext(ShopContext);
  const navigate = useNavigate();
  const hasValidated = useRef(false);

  useEffect(() => {
    refetchProducts();  // Refetch products to ensure we have the latest data
  }, [refetchProducts]);

  useEffect(() => {
    const handleValidation = async () => {
      if (hasValidated.current) return;  // Prevent multiple calls
      hasValidated.current = true;

      try {
        const response = await validateSuccess({ variables: { randomValue } });
        console.log("Validation successful and Cart cleared:", response.data.validateSuccess.success);
        await refetchCart();
      } catch (error) {
        if (error.message.includes('Cannot read properties of undefined')) {
          console.error('Guest checkout with no user ID, treating as guest');
          localStorage.removeItem('cartItems');
          console.log("Guest checkout, cart cleared from localStorage.");
          setCartItems(getDefaultCart(products?.length));
        } else {
          console.error("Validation Failed:", error);
          navigate("/not-found", { replace: true });
        }
      }
    };

    handleValidation();
  }, [randomValue, validateSuccess, refetchCart, products?.length]);

  return (
    <div className="success-container">
      <div className="success-message">
        <p>We appreciate your business! Thanks for your order</p>
      </div>
    </div>
  );
};

export default Success;
