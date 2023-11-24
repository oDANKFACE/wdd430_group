import React from 'react';
import { GetServerSideProps } from 'next';

export interface Product {
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
      {products.map((p) => (
        <div>{p.name}</div>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products');
  const products = await res.json();
  return {
    props: { products },
  };
};

export default Products;
