import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// GET api/review

export interface Review {
  rating: number;
  comment?: string;
  authorEmail: string;
  productId: string;
}

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
