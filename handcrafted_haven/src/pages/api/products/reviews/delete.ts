import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function deleteReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { reviewId } = req.query;

    if (!reviewId) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: reviewId' });
    }

    const parsedReviewId = Array.isArray(reviewId) ? reviewId[0] : reviewId;

    const deletedReview = await prisma.review.delete({
      where: {
        id: parsedReviewId,
      },
    });

    res
      .status(200)
      .json({ message: 'Review deleted successfully', deletedReview });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
