import React, { useContext, useEffect } from "react";
import { AppBar, Button, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'phosphor-react';
import { AuthContext } from '../context/auth-context';
import './navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    console.log("User after change:", user);
  }, [user]);

  return (
    <AppBar
      className="navbar"
      position="fixed"
      sx={{
        background: 'linear-gradient(45deg, #e20000, #9b111e)',
        padding: '0 20px',
        zIndex: 1000,
      }}
    >
      <Toolbar>
        <div className="navbar-links">
          <Button color="inherit" component={Link} to="/shop">
            Shop
          </Button>
          <Button color="inherit" component={Link} to="/cart" className="navbar-cart-button">
            Shopping Cart
            <ShoppingCart size={32} />
          </Button>

          {user ? (
            <div className="navbar-loggedin">
              <em>{user.name} logged in</em>
              <Button onClick={handleLogout}>Log out</Button>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Log in
            </Button>
          )}

          {user && (
            <div className="navbar-order-history">
              <Button color="inherit" component={Link} to="/order-history">
                Order History
              </Button>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
