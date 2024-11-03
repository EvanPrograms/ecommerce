import React from 'react'
import { useParams } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Product 1',
    image: './hersheys.jpeg', // Replace with actual image URL
    description: 'Description of product 1.'
  },
  {
    id: 2,
    name: 'Product 2',
    image: 'https://via.placeholder.com/300', // Replace with actual image URL
    description: 'Description of product 2.'
  },
  {
    id: 3,
    name: 'Product 3',
    image: 'https://via.placeholder.com/300', // Replace with actual image URL
    description: 'Description of product 3.'
  }
  // Add more products as needed
]

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((product) => product.id === Number(id))
  console.log(product.name)
  if (!product) {
    return <h2>Product not found</h2>;
  }

  return(
    <div>
      <h1>
        {product.name}
      </h1>
    </div>
  )
}

export default ProductDetails;