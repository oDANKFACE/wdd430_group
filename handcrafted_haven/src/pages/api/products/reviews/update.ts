import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { Review } from '@/types';

export default async function updateReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { rating, comment, id } = JSON.parse(req.body) as Review;

    if (!rating || !id) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const review = await prisma.review.update({
      where: {
        id,
      },
      data: {
        rating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
