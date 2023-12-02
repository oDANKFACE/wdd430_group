import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { Product, User } from '@/types';
import { getBaseUrl } from '@/helpers/utils';
import withLayout from '@/components/hoc/withLayout';
import { useSession } from 'next-auth/react';
import FileUpload from '@/components/FileUpload';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const ProductFormPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { productId } = router.query;
  const user = session?.user as User;

  const [clearFileUpload, setClearFileUpload] = useState(false);
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    sellerId: '',
  });

  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const getProduct = useCallback(async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/products/read?productId=${productId}`,
      );

      const productData = await res.json();
      if (!res.ok) {
        throw Error(productData);
      }
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }, [baseUrl, productId]);

  const handleInputChange = (field: string, value: string | number) => {
    setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/products/delete?productId=${productId}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        throw Error('Failed to delete product');
      }
      router.push(`/artists/${user.id}`);
    } catch (error: any) {
      console.error('Error submitting product:', error);
    }
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

  const handleImageChange = (base64Strings: string[]) => {
    setProduct((prevProduct) => ({ ...prevProduct, images: base64Strings }));
    setClearFileUpload(true);
  };

  const handleDeleteImage = (index: number) => {
    setProduct((prevProduct) => {
      const updatedImages = [...(prevProduct.images ?? [])];
      updatedImages.splice(index, 1);
      return { ...prevProduct, images: updatedImages };
    });
  };

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId, getProduct]);

  return (
    <div className="flex flex-col px-2 md:px-24 my-10">
      <Head>
        <title>Artist Products</title>
      </Head>
      <h1 className="text-3xl font-semibold mb-4">
        {productId ? 'Edit Product' : 'Add New Product'}
      </h1>
      <div className="flex justify-center w-full">
        <form className="w-4/5 md:3/4 lg:w-1/2 border rounded p-4 bg-gray-200">
          <Input
            label="Product Name"
            value={product.name}
            onChange={(value) => handleInputChange('name', value)}
          />
          <div className="h-28 mb-10">
            <TextArea
              label="Product Description"
              value={product.description}
              onChange={(value) => handleInputChange('description', value)}
            />
          </div>
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
          {!!product.images?.length && (
            <div className="h-96 sm:h-40 flex flex-col sm:flex-row">
              {product.images?.map((i, index) => (
                <div key={index} className="relative h-full w-full m-1">
                  <Image
                    src={i}
                    alt={product.name ?? 'Product'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"
                    onClick={() => handleDeleteImage(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <FileUpload
            onFileChange={handleImageChange}
            multiple={true}
            onClearFile={() =>
              setProduct((prevProduct) => ({ ...prevProduct, images: [] }))
            }
            clear={clearFileUpload}
          />

          <div className="flex flex-col md:flex-row justify-around">
            <Link
              href={`/artists/${user?.id}`}
              className="px-12 py-1 text-lg text-center font-semibold text-dark transition-colors duration-300 bg-white border-2 border-gray-500 rounded-md shadow hover:bg-gray-500 focus:outline-none focus:ring-gray-200 hover:text-white focus:ring-4"
            >
              Cancel
            </Link>
            {productId && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-12 py-1 text-lg font-semibold text-dark transition-colors duration-300 bg-white border-2 border-red-500 rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring-gray-200 hover:text-white focus:ring-4 my-2 md:my-0"
              >
                Delete
              </button>
            )}
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
