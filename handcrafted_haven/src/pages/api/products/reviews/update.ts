import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { Review } from './create';

export default async function updateReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { rating, comment, authorEmail, productId } =
      req.body as Review;

    if (!rating || !authorEmail || !productId) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        author: {
          connect: {
            email: authorEmail,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
