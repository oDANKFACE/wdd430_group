import React, { useState, ChangeEvent, useEffect } from 'react';
import withLayout from '@/components/hoc/withLayout';
import { Review, Product, User } from '@/types';
import { useRouter } from 'next/router';
import { getBaseUrl } from '@/helpers/utils';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

const ReviewForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<Review>();

  const reviewId = router.query.reviewId as string;
  const user = session?.user as User;
  const baseUrl = getBaseUrl();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/products/reviews/read?reviewId=${reviewId}`,
        );

        if (res.ok) {
          const review = await res.json();
          setReview(review);
          setRating(review.rating);
          setComment(review.comment);
        } else {
          console.error('Error fetching review details');
        }
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    };

    if (reviewId) {
      fetchReviewDetails();
    }
  }, [reviewId]);

  useEffect(() => {
    if (!!user && !!review) {
      if (user.id != review.authorId) {
        router.push(`/products/${review.productId}`);
      }
    }
  }, [user, review]);

  const handleUpdateReview = async () => {
    if (comment && rating > 0 && rating <= 5) {
      const newReview: Review = {
        id: reviewId,
        comment,
        rating,
      };
      try {
        const res = await fetch(`${baseUrl}/api/products/reviews/update`, {
          method: 'PATCH',
          body: JSON.stringify(newReview),
        });
        if (!res.ok) {
          throw new Error('Failed to update review.');
        }
        const review = await res.json();
        router.push(`/products/${review.productId}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteReview = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/products/reviews/delete?reviewId=${reviewId}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        throw new Error('Failed to delete review.');
      }
      router.push(`/products/${review?.productId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md my-5">
      <h2 className="text-2xl font-semibold text-black mb-4">
        Update Review for {review?.product?.name}
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
      <div className="flex justify-around">
        <Link
          href={`/products/${review?.productId}`}
          className="w-full text-center border-2 border-gray-500 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
        >
          Cancel
        </Link>
        <button
          className="w-full mx-1 border-2 border-red-400 text-gray-800 py-2 px-4 rounded-md hover:bg-red-200 transition duration-300"
          onClick={handleDeleteReview}
        >
          Delete
        </button>
        <button
          className="w-full bg-secondary border-2 border-secondary text-gray-800 py-2 px-4 rounded-md hover:bg-emerald-200 transition duration-300"
          onClick={handleUpdateReview}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default withLayout(ReviewForm);
