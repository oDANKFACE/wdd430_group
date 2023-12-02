import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { Product, User } from '@/types';
import { getBaseUrl } from '@/helpers/utils';
import withLayout from '@/components/hoc/withLayout';
import { useSession } from 'next-auth/react';

const ProductFormPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { productId } = router.query;
  const user = session?.user as User;

  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    sellerId: '',
  });

  const baseUrl = getBaseUrl();

  console.log({ productId });

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  const getProduct = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/products/read?productId=${productId}`,
      );

      const productData = await res.json();
      if (!res.ok) {
        throw Error(productData);
      }
      console.log({ productData });
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      let res;
      const body = JSON.stringify({ ...product, sellerId: user.id });
      if (productId) {
        res = await fetch(
          `${baseUrl}/api/products/update?productId=${productId}`,
          {
            method: 'PATCH',
            body,
          },
        );
      } else {
        res = await fetch(`${baseUrl}/api/products/create`, {
          method: 'POST',
          body,
        });
      }
      const productData = await res.json();

      if (!res.ok) {
        throw Error(productData);
      }

      router.push(`/artists/${user.id}`);
    } catch (error: any) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div className="flex flex-col px-2 md:px-24 my-10">
      <h1 className="text-3xl font-semibold mb-4">
        {productId ? 'Edit Product' : 'Add New Product'}
      </h1>
      <div className="flex justify-center w-full">
        <form className="w-4/5 md:w-1/2 border rounded p-4 bg-gray-200">
          <Input
            label="Product Name"
            value={product.name}
            onChange={(value) => handleInputChange('name', value)}
          />
          <TextArea
            label="Product Description"
            value={product.description}
            onChange={(value) => handleInputChange('description', value)}
          />
          <Input
            type="number"
            label="Price"
            value={product.price || 0}
            onChange={(value) => handleInputChange('price', value)}
          />
          <Input
            label="Category"
            value={product.category}
            onChange={(value) => handleInputChange('category', value)}
          />

          {/* Other input fields for images, etc. */}
          <div className="flex flex-col sm:flex-row justify-around">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-12 py-1 text-lg font-semibold text-dark transition-colors duration-300 bg-white border-2 border-gray-500 rounded-md shadow hover:bg-gray-500 focus:outline-none focus:ring-gray-200 hover:text-white focus:ring-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-12 py-1 text-lg font-semibold text-dark transition-colors duration-300 bg-secondary rounded-md shadow hover:bg-emerald-400 focus:outline-none focus:ring-emerald-200 focus:ring-4 mt-1 sm:mt-0"
            >
              {productId ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withLayout(ProductFormPage);
