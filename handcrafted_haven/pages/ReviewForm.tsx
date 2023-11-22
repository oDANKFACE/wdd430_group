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
    <div>
      <h2>Add a Review</h2>
      <div>
        <label>Your Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
        />
      </div>
      <div>
        <label>Rating:</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRating(parseInt(e.target.value, 10))}
        />
      </div>
      <button onClick={handleAddReview}>Add Review</button>
    </div>
  );
};

export default ReviewForm;


