import React, { useContext, useEffect } from "react";

import {
  AppBar,
  Button,
  Toolbar
} from '@mui/material'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'phosphor-react'
import './navbar.css'
import { useApolloClient } from "@apollo/client";
import { AuthContext } from '../context/auth-context'



const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const client = useApolloClient()

  const handleLogout = () => {
    console.log('logging out')
    logout()
  }

  useEffect(() => {
    console.log("user after change:", user);
  }, [user]);

  return (
    <AppBar 
      position="fixed" 
      className="navbar" 
      sx={{ 
        background: 'linear-gradient(45deg, #e20000, #9b111e)'  // Gradient similar to home.css
      }}
    >
      <Toolbar>
        <div className="links">
          <Button color="inherit" component={Link} to="/shop">
            Shop
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            Shopping Cart
            <ShoppingCart size={32}/>
          </Button> 
          {user
            ? <div className="loggedin">
                <em>{user.name} logged in</em>
                <Button onClick={handleLogout}>Log out</Button>
              </div>
            : <Button color="inherit" component={Link} to="/login">
                log in
              </Button>
          }
          {user
            ? <div className="orderhistory">
                <Button color="inherit" component={Link} to="/order-history">
                  Order History
                </Button>
              </div>
             :  <></>
          }
        </div>                         
      </Toolbar>
    </AppBar>
  )
}

export default Navbar