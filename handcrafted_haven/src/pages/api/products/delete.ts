import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function deleteReview(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { productId } = req.query;

    if (!productId) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: productId' });
    }

    const parsedProductId = Array.isArray(productId) ? productId[0] : productId;

    await prisma.$transaction([
      prisma.review.deleteMany({
        where: {
          productId: parsedProductId,
        },
      }),
      prisma.product.delete({
        where: {
          id: parsedProductId,
        },
      }),
    ]);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
