import React from 'react';

interface Review {
  id: number;
  user: string;
  comment: string;
  rating: number;
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.user}</strong>: {review.comment} - Rating:{' '}
            {review.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
