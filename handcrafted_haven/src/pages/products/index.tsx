import React from 'react';
import { GetServerSideProps } from 'next';
import withLayout from '@/components/hoc/withLayout';
import { getBaseUrl } from '@/helpers/utils';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CustomFilter from '@/components/CustomFilter';
import { categories } from '@/constants/constants';

interface ProductProps {
  products: Product[];
}

const url = getBaseUrl();

const Products = ({ products }: ProductProps) => {
  return (
    <div className="container mx-auto p-6 border border-white rounded mt-1">
      <h1 className="text-3xl font-semibold mb-4">Our Products</h1>
      <div className="mt-2 padding-x max-widt rounded-md">
        <div className='filters'>
          <SearchBar />
          <div className='filter-container'>
          <p className='px-3'>Categories</p>  
          <CustomFilter title='Categories'option={categories}
          />
        </div>
        </div>
      </div>

      <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="">
            <div className="bg-gray-200 p-4 rounded-md shadow-md hover:scale-105 transition-transform duration-300 ease-in-out border-4 border-accent">
              {/* Product Image */}
              {!!product.images?.length && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="w-full h-32 object-cover mb-2 rounded-md"
                />
              )}

              {/* Product Details */}
              <div className="flex justify-between font-semibold text-gray-800 text-lg">
                <h2 className="mb-2">{product.name}</h2>
                <p className="">${product.price}</p>
              </div>
              <p className="text-gray-700 mb-2">{product.description}</p>

              {/* Additional Product Information */}
              <div className="mt-2 flex text-gray-600 text-sm font-semibold">
                <p>Category: &nbsp;</p>
                <p>{product.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${url}/api/products/readAll`);

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const products = await res.json();

    return {
      props: { products },
    };
  } catch (error: any) {
    console.error('Error fetching data:', error.message);

    return {
      props: {
        products: [],
      },
    };
  }
};

export default withLayout(Products);
