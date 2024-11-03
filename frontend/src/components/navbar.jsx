import React from "react";

import {
  AppBar,
  Button,
  Toolbar
} from '@mui/material'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'phosphor-react'
import './navbar.css'

const Navbar = () => {
  const user = "John doe"

  return (
    <AppBar position="static" className="navbar" >
      <Toolbar>
        <div className="links">
          <Button color="inherit" component={Link} to="/shop">
            Shop
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            Shopping Cart
            <ShoppingCart size={32}/>
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>   
          {user
            ? <em>{user} logged in</em>
            : <Button color="inherit" component={Link} to="/login">
                login
              </Button>
          }     
        </div>                         
      </Toolbar>
    </AppBar>
  )
}

export default Navbar