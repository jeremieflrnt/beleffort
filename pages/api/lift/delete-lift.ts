import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE' && !req.cookies['next-auth.session-token']) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  if (!req.body.id) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { id } = req.body;

  const sessionToken = req.cookies['next-auth.session-token'];
  try {
    const sets = prisma.set.deleteMany({
      where: {
        liftId: id,
      },
    });

    const lift = prisma.lift.delete({
      where: {
        id: id,
        owner: {
          sessions: {
            some: {
              sessionToken: sessionToken,
            },
          },
        },
      },
    });

    const transaction = await prisma.$transaction([sets, lift]);
    res.status(200).json(lift);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
