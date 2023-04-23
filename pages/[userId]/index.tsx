import Head from 'next/head';
import Lifts from '@/components/weightlifting/Lifts';
import { Lift } from '@/types/Lift';
import prisma from '../../lib/prisma';
import { useState } from 'react';
import PlusSvg from '@/components/svg/Plus';
import AddLift from '@/components/weightlifting/modals/AddLift';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

const UserPage = (props: any) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () =>
    setOpen((prev) => {
      return !prev;
    });

  const [lifts, setLifts] = useState(props.lifts);
  console.log('lifts', lifts);
  const handleSubmitAddNew = (data: Lift[]) => {
    setLifts([...data]);
  };

  return (
    <>
      <Head>
        <title>BelEffort - My PRs in Weightlifting</title>
        <meta name="description" content="BelEffort - My PRs in Weightlifting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Lifts lifts={lifts} />
      <label onClick={handleToggle} className="btn-circle btn absolute bottom-0 right-0 m-4">
        <PlusSvg />
      </label>
      <AddLift open={open} onClose={handleToggle} onSubmit={handleSubmitAddNew}></AddLift>
    </>
  );
};

export default UserPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  let sessionToken = '';
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
    const secureSessionTokenCookie = req.cookies['__Secure-next-auth.session-token'];
    if (secureSessionTokenCookie) sessionToken = secureSessionTokenCookie;
    else console.log('Missing secure session token in cookies');
  } else {
    const sessionTokenCookie = req.cookies['next-auth.session-token'];
    if (sessionTokenCookie) sessionToken = sessionTokenCookie;
    else console.log('Missing session token in cookies');
  }

  if (!sessionToken)
    return {
      notFound: true,
    };

  const user = await prisma.user.findFirstOrThrow({
    where: {
      sessions: {
        some: {
          sessionToken: sessionToken,
        },
      },
    },
    select: {
      name: true,
      lifts: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          movement: true,
          sets: {
            distinct: ['rep'],
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              rep: true,
              weight: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  const lifts: Lift[] = [];
  user?.lifts.forEach((lift) => {
    lifts.push(new Lift(lift.id, lift.movement, lift.sets));
  });

  return {
    props: { lifts: JSON.parse(JSON.stringify(lifts)) },
  };
}
