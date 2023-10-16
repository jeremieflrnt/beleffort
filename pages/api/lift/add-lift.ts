import { isValidMovement, isValidReps, isValidWeight } from '@/components/weightlifting/modals/AddLift';
import { getSessionToken } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getSessionToken(req);
  if (req.method !== 'POST' || !sessionToken) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  if (!req.body.movement || !req.body.reps || !req.body.weight) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { movement, reps, weight } = req.body;

  if (isValidMovement(movement) || isValidReps(Number(reps)) || isValidWeight(Number(weight))) {
    let foundUser: {
      userId: string;
    };
    try {
      foundUser = await prisma.session.findFirstOrThrow({
        where: {
          sessionToken: sessionToken,
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
    if (foundUser.userId) {
      try {
        const user = await prisma.user.update({
          where: { id: foundUser!.userId },
          data: {
            lifts: {
              create: [
                {
                  movement: movement,
                  sets: {
                    create: [
                      {
                        rep: Number(reps),
                        weight: Number(weight),
                      },
                    ],
                  },
                },
              ],
            },
          },
          select: {
            lifts: {
              select: {
                id: true,
                movement: true,
                sets: {
                  select: {
                    id: true,
                    rep: true,
                    weight: true,
                  },
                },
              },
            },
          },
        });
        res.status(201).json(user);
      } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred.' });
      }
    }
  }
}
