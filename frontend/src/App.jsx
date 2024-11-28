import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/shop/Shop'
import ProductDetails from './pages/productDetails/ProductDetails';
import Cart from './pages/cart/Cart';
import AuthPage from './pages/login/AuthPage'
import SignUp from './pages/login/SignUp';
import Success from './pages/checkout/success';
import Cancel from './pages/checkout/Cancel';
import OrderHistory from './pages/orderHistory/OrderHistory';
import Navbar from './components/navbar'
import ResetPassword from './pages/login/ResetPassword';
import ResetPasswordSubmission from './pages/login/ResetPasswordSubmission';

import { ShopContextProvider } from './context/shop-context';
import { AuthContextProvider } from './context/auth-context'
// import Checkout from './pages/Checkout';

const App = () => {
  
  return (
    <AuthContextProvider>
      <ShopContextProvider> 
        <Router>
          {location.pathname !== '/' && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="resetpassword" element={<ResetPassword />} />
            <Route path="resetpasswordform" element={<ResetPasswordSubmission />} />
            <Route path="/success/:randomValue" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/order-history" element={<OrderHistory />} />
            {/* <Route path="/checkout" element={<Checkout />} /> */}
          </Routes>
        </Router>
      </ShopContextProvider>
    </AuthContextProvider>
  );
}

export default App;
