import React from 'react';
import { GetServerSideProps } from 'next';
import withLayout from '@/components/hoc/withLayout';

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
    <div className={`flex min-h-screen flex-col container px-4 md:px-24 my-10`}>
      <h1 className="text-4xl mb-5">Product Listings</h1>
      <div className="border rounded p-4">
        <div className="flex border">
          {products.map((product) => (
            <div className="border  border-accent">
              {product.name} - ${product.price}.00
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/products/readAll');
  const products = await res.json();
  return {
    props: { products },
  };
};

export default withLayout(Products);
