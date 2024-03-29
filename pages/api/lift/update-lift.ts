import { isValidMovement } from '@/components/weightlifting/modals/AddLift';
import { getSessionToken } from '@/lib/utils';
import { Lift } from '@/types/Lift';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getSessionToken(req);
  if (req.method !== 'PUT' || !sessionToken) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!req.body.id || !req.body.movement) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { id, movement } = req.body as { id: string; movement: string };
  if (isValidMovement(movement)) {
    try {
      await prisma.session.findFirstOrThrow({
        where: {
          sessionToken: sessionToken,
          user: {
            lifts: {
              some: {
                id: id,
              },
            },
          },
        },
        select: {
          userId: true,
        },
      });
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'An error occurred.' });
      return;
    }

    try {
      const lift = await prisma.lift.update({
        where: { id: id },
        data: {
          movement: movement,
        },
        select: {
          id: true,
          movement: true,
          sets: true,
        },
      });
      res.status(200).json(new Lift(lift.id, lift.movement, lift.sets));
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  }
}
