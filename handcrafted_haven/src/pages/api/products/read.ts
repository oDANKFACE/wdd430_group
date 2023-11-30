import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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

    const product = await prisma.product.findFirst({
      where: {
        id: String(productId),
      },
      include: {
        seller: true,
        reviews: {
          include: {
            author: true,
          }
        },
      }
    });

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export const getProductIds = async () => {
  try {
    const ids = await prisma.product.findMany({
      select: {
        id: true,
      },
    });
    return ids.map((p) => p.id);
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};