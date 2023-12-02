import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Product } from '@/types';

export default async function updateProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { productId } = req.query;

    if (!productId) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: productId' });
    }

    const { name, description, price, images, category, sellerId } = JSON.parse(
      req.body,
    ) as Product;

    if (!name || !price || !category || !sellerId) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const parsedProductId = Array.isArray(productId) ? productId[0] : productId;

    const product = await prisma.product.update({
      where: { id: parsedProductId },
      data: {
        name,
        description,
        price: typeof price === 'string' ? +price : price,
        images,
        category,
        seller: {
          connect: {
            userId: sellerId,
          },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
