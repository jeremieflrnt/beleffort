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

  /* try {
    const foundSet = await prisma.session.findFirstOrThrow({
      where: {
        sessionToken: sessionToken,
        user: {
          lifts: {
            some: {
              sets: {
                some: {
                  id: id,
                },
              },
            },
          },
        },
      },
      select: {
        userId: true,
      },
    });
    console.log('foundSet.userId', foundSet.userId);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }

  try {
    const set = await prisma.set.delete({
      where: { id: id },
    });
    res.status(200).json(set);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'An error occurred.' });
  } */
}
