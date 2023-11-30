import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

// GET api/review

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const reviews = await prisma.review.findMany();

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
