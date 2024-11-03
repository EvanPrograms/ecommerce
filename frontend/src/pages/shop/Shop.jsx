import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import products from '../../products'
import Product from './Product';
import './shop.css'

// const products = [
//   {
//     id: 1,
//     name: 'Product 1',
//     image: './hersheys.jpeg', // Replace with actual image URL
//     description: 'Description of product 1.',
//   },
//   {
//     id: 2,
//     name: 'Product 2',
//     image: 'https://via.placeholder.com/300', // Replace with actual image URL
//     description: 'Description of product 2.',
//   },
//   {
//     id: 3,
//     name: 'Product 3',
//     image: 'https://via.placeholder.com/300', // Replace with actual image URL
//     description: 'Description of product 3.',
//   },
//   // Add more products as needed
// ];

const Products = () => {
  return (
    <div className="shop">
      <div className="shopTitle">
        <h1>Cool Chocolates</h1>
      </div>
      <div className="products">
        {products.map((product) => <Product key={product.id} data={product}/>)}
      </div>
    </div>
  );
};

export default Products;
