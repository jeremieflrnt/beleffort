import { getSessionToken } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getSessionToken(req);
  if (req.method !== 'DELETE' || !sessionToken) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!req.body.id) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { id } = req.body as { id: string };

  try {
    const set = await prisma.set.delete({
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
    });
    res.status(200).json(set);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
}
