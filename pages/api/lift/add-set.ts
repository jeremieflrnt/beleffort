import { isValidReps, isValidWeight } from '@/components/weightlifting/modals/AddLift';
import { getSessionToken } from '@/lib/utils';
import { Lift } from '@/types/Lift';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = getSessionToken(req);
  if (req.method !== 'POST' || !sessionToken) {
    res.status(500).json({ message: 'An error occurred.' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!req.body.id || !req.body.reps || !req.body.weight) {
    res.status(422).json({ message: 'Required fields are not provided.' });
    return;
  }

  const { id, reps, weight } = req.body as { id: string; reps: number; weight: number };

  if (isValidWeight(Number(weight)) && isValidReps(Number(reps))) {
    try {
      const foundSetForSameRep = await prisma.lift.findFirst({
        where: {
          id: id,
          owner: {
            sessions: {
              some: {
                sessionToken: sessionToken,
              },
            },
          },
          sets: {
            some: {
              rep: Number(reps),
            },
          },
        },
        select: {
          sets: {
            where: {
              rep: Number(reps),
            },
          },
        },
      });
      if (foundSetForSameRep) {
        const lift = await prisma.lift.update({
          where: { id: id },
          data: {
            sets: {
              update: {
                where: {
                  id: foundSetForSameRep.sets[0].id,
                },
                data: {
                  rep: Number(reps),
                  weight: Number(weight),
                },
              },
            },
          },
          select: {
            id: true,
            movement: true,
            sets: true,
          },
        });
        res.status(200).json(new Lift(lift.id, lift.movement, lift.sets));
      } else {
        const lift = await prisma.lift.update({
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
          data: {
            sets: {
              create: {
                rep: Number(reps),
                weight: Number(weight),
              },
            },
          },
          select: {
            id: true,
            movement: true,
            sets: true,
          },
        });
        res.status(201).json(new Lift(lift.id, lift.movement, lift.sets));
      }
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  }
}
