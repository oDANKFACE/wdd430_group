import React, { useState, ChangeEvent, useEffect } from 'react';
import withLayout from '@/components/hoc/withLayout';
import { Review, Product, User } from '@/types';
import { useRouter } from 'next/router';
import { getBaseUrl } from '@/helpers/utils';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';

const ReviewForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [product, setProduct] = useState<Product>();

  const productId = router.query.productId as string;
  const user = session?.user as User;
  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/products/read?productId=${productId}`,
        );

        if (response.ok) {
          const product = await response.json();
          setProduct(product);
        } else {
          console.error('Error fetching product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId, baseUrl]);

  const handleAddReview = async () => {
    if (comment && rating > 0 && rating <= 5) {
      const newReview: Review = {
        authorId: user.id,
        productId,
        comment,
        rating,
      };

      try {
        const res = await fetch(`${baseUrl}/api/products/reviews/create`, {
          method: 'POST',
          body: JSON.stringify(newReview),
        });

        if (!res.ok) {
          throw new Error('Failed to create new review.');
        }

        const review = await res.json();
        router.push(`/products/${productId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md my-5">
      <Head>
        <title>Product Review</title>
      </Head>
      <h2 className="text-2xl font-semibold text-black mb-4">
        Add a Review for {product?.name}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Rating: &nbsp;
          <span className="text-xs text-gray-400">(out of 5)</span>
        </label>
        <input
          type="number"
          min="1"
          max="5"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
          value={rating}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRating(parseInt(e.target.value, 10))
          }
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Comment:
        </label>
        <textarea
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setComment(e.target.value)
          }
        ></textarea>
      </div>
      <div className="text-center">
        <button
          className="bg-secondary text-gray-800 py-2 px-4 rounded-md hover:bg-emerald-200 transition duration-300"
          onClick={handleAddReview}
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default withLayout(ReviewForm);
