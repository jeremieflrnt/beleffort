import { isValidMovement, isValidReps, isValidWeight } from '@/components/weightlifting/modals/AddLift';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' && !req.cookies['next-auth.session-token']) {
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
    const sessionToken = req.cookies['next-auth.session-token'];
    try {
      foundUser = await prisma.session.findFirstOrThrow({
        where: {
          sessionToken: sessionToken,
        },
        select: {
          userId: true,
        },
      });
      console.log('foundUser.userId', foundUser.userId);
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
// let userSession;
//   const sessionToken = req.cookies['next-auth.session-token'];
//   try {
//     userSession = await prisma.session.update({
//       where: {
//         sessionToken: sessionToken,
//       },
//       data: {
//         user: {
//           update: {
//             lifts: {
//               create: [
//                 {
//                   movement: movement,
//                   sets: {
//                     create: [
//                       {
//                         rep: Number(reps),
//                         weight: Number(weight),
//                       },
//                     ],
//                   },
//                 },
//               ],
//             },
//           },
//         },
//       },
//       select: {
//         user: {
//           select: {
//             lifts: {
//               select: {
//                 movement: true,
//                 sets: {
//                   select: {
//                     id: true,
//                     rep: true,
//                     weight: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//     res.status(201).json(userSession.user);
//   } catch (error) {
//     console.error('error', error);
//     res.status(500).json({ message: 'An error occurred.' });
//   }