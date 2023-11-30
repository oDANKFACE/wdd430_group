import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { Review } from '@/types';

// GET api/review

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { rating, comment, authorEmail, productId } = req.body as Review;

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
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
