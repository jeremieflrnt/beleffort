import { isValidWeight } from '@/components/weightlifting/modals/AddLift';
import { getSessionToken } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getSessionToken(req);
  if (req.method !== 'PUT' || !sessionToken) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!req.body.id || !req.body.weight) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { id, weight } = req.body as { id: string; weight: string };

  if (isValidWeight(Number(weight))) {
    try {
      const set = await prisma.set.update({
        where: {
          id: id,
          lift: {
            owner: {
              sessions: {
                some: {
                  sessionToken: sessionToken,
                },
              },
            },
          },
        },
        data: {
          weight: Number(weight),
        },
        select: {
          id: true,
          rep: true,
          weight: true,
          updatedAt: true,
        },
      });
      res.status(200).json(set);
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  }
}
