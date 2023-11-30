import withLayout from '@/components/hoc/withLayout';

import React, { useState, ChangeEvent } from 'react';
interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number;
}
interface ReviewFormProps {
  onAddReview: (review: Review) => void;
}
const ReviewForm: React.FC<ReviewFormProps> = ({  }) => {
  const [userName, setUserName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const onAddReview = (newReview:Review) => {console.log(newReview)}
  const handleAddReview = (): void => {
    // Perform validation if needed
    if (userName && comment && rating > 0 && rating <= 5) {
      const newReview: Review = {
        id: Date.now(), // For simplicity, using timestamp as ID
        user: userName,
        comment,
        rating,
      };
      onAddReview(newReview);
      // Clear the form fields after adding the review
      setUserName('');
      setComment('');
      setRating(0);
    }
  };
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
  <h2 className="text-2xl font-semibold text-black mb-4">Add a Review</h2>
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600">Your Name:</label>
    <input
      type="text"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
      value={userName}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
    />
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600">Comment:</label>
    <textarea
      className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
      value={comment}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
    ></textarea>
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-600">Rating:</label>
    <input
      type="number"
      min="1"
      max="5"
      className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black"
      value={rating}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setRating(parseInt(e.target.value, 10))}
    />
  </div>
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
    onClick={handleAddReview}
  >
    Add Review
  </button>
</div>



  );
};

// export default ReviewForm;

export default withLayout(ReviewForm);
