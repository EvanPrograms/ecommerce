import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
// import products from '../../products'
import Product from './Product';
import './shop.css'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'
import { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';

const Products = () => {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: () => axios.get('http://localhost:5000/api/products').then(res => res.data)
  // })

  // console.log('this is query', data)

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {error.message}</div>
  const { products, isLoading, error } = useContext(ShopContext); // Access products from context

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
