import React from 'react';
import { GetServerSideProps } from 'next';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductProps {
  products: Product[];
}

const Products = ({ products }: ProductProps) => {
  return (
    <>
      <div>
        <h2>Product List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - {product.price}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const products = await res.json();
  console.log({products});
  return {
    props: { products },
  };
};

export default Products;
