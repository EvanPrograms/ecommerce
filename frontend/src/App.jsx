import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/shop/Shop'
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/cart/Cart';
import Navbar from './components/navbar'
import { ShopContextProvider } from './context/shop-context';
// import Checkout from './pages/Checkout';

const App = () => {
  
  return (
    <ShopContextProvider>
      <Router>
        {location.pathname !== '/' && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
        </Routes>
      </Router>
    </ShopContextProvider>
  );
}

export default App;
