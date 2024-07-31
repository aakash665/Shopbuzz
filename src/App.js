import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductPage from './components/ProductPage';
import ShoppingCart from './components/ShoppingCart';
import Orders from './components/Orders';
import ProfilePage from './components/ProfilePage';
import Wishlist from './components/Wishlist';
import Analytics from './components/Analytics';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [cart, setCart] = React.useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar isLoggedIn={isLoggedIn} /> {/* Optional: Navigation bar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
          <Route path="/cart" element={<ShoppingCart cartItems={cart} removeFromCart={removeFromCart} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
