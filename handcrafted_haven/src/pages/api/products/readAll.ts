import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET api/review

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true, reviews: true },
    });
    console.log({ products });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
