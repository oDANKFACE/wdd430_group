import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SellerProfile } from '@prisma/client';

export default async function updateArtist(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { artistId } = req.query;

    if (!artistId) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: productId' });
    }

    const sellerProfile = JSON.parse(req.body);

    if (!sellerProfile) {
      return res.status(400).json({ error: 'Missing required data.' });
    }

    const parsedArtistId = Array.isArray(artistId) ? artistId[0] : artistId;

    const artist = await prisma.user.findFirst({
      where: { id: parsedArtistId },
      include: { sellerProfile: true },
    });

    if (!artist) {
      return res.status(400).json({ error: 'Artist not found.' });
    }

    const { bio, image } = sellerProfile;

    let profileId;
    if (!!artist.sellerProfile) {
      profileId = artist.sellerProfile.id;
    }

    const updatedProfile: Partial<SellerProfile> = {
      bio,
      image,
    };

    const seller = await prisma.sellerProfile.update({
      where: { id: profileId },
      data: updatedProfile,
    });

    res.status(200).json(seller);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
