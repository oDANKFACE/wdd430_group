import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { reviewId } = req.query;

    if (!reviewId) {
      return res.status(400).json({ error: 'Missing reviewId parameter.' });
    }

    const review = await prisma.review.findFirst({
      where: {
        id: String(reviewId),
      },
      include: {
        product: true,
        author: true,
      }
    });

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
