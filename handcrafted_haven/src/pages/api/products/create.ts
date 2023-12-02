import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Product } from '@/types';

// GET api/review

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { name, description, price, images, category, sellerId } = JSON.parse(
      req.body,
    ) as Product;

    if (!name || !price || !category || !sellerId) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const product = await prisma.product.create({
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
