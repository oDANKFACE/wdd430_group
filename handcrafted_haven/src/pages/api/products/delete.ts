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

    const { ProductId } = req.query;

    if (!ProductId) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: ProductId' });
    }

    const parsedProductId = Array.isArray(ProductId) ? ProductId[0] : ProductId;

    const deletedProduct = await prisma.product.delete({
      where: {
        id: parsedProductId,
      },
    });

    res
      .status(200)
      .json({ message: 'Review deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
