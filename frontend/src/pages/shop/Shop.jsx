import React from 'react';
import Product from './Product';
import { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import './Shop.css'

const Products = () => {
  const { products, isLoading, error } = useContext(ShopContext); 

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="shop">
      <div className="shopTitle">
        <h1>Passion Chocolates</h1>
      </div>
      <div className="products">
        {products.map((product) => <Product key={product.id} data={product}/>)}
      </div>
    </div>
  );
};

export default Products;
