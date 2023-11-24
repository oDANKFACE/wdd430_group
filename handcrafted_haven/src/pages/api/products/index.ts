import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET api/product
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const products = await prisma.product.findMany({
    include: { creator: true },
  });

  res.json(products);
}
