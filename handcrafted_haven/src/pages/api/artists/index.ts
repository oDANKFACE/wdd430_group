import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { convertDatesToStrings } from '@/helpers/server-helpers';

export interface Artist {
  id: string;
  firstName?: string;
  lastName?: string;
  sellerProfile?: SellerProfile | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SellerProfile {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  bio?: string | null;
  userId?: string;
  products?: Product[];
}

export interface Product {
  id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  images?: string[];
  category?: string;
  sellerId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// GET api/artists
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const artists = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        sellerProfile: true,
      },
    });
    const serialized = convertDatesToStrings(artists);
    res.json(serialized);
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
}

export const getArtistById = async (id: string) => {
  try {
    const artist = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        sellerProfile: {
          include: {
            products: true,
          },
        },
      },
    });
    const serialized = convertDatesToStrings(artist);
    return serialized;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};

export const getArtistIds = async () => {
  try {
    const ids = await prisma.user.findMany({
      select: {
        id: true,
      },
    });
    return ids.map((user) => user.id);
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};
