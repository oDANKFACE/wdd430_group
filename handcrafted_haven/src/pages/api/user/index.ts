import { connectToDatabase } from '@/helpers/server-helpers';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase();
    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        }
    });
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

export default GET;
