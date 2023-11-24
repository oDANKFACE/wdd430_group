import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// GET api/product
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const artists = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      bio: true,
    }
  });
  res.json(artists);
}
