import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// GET api/review

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ error: 'Missing productId parameter.' });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: String(productId),
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
