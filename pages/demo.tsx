import Lifts from '@/components/weightlifting/Lifts';
import AddLift from '@/components/weightlifting/modals/AddLift';
import { getSessionToken } from '@/lib/utils';
import { Lift } from '@/types/Lift';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import prisma from '../lib/prisma';

const UserPage = (props: any) => {
  const handleToggle = () => (document.getElementById('modal-add-lift') as HTMLDialogElement)!.showModal();

  const [lifts, setLifts] = useState(props.lifts);

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
        <FiPlus size={'2em'} />
      </label>
      <AddLift onSubmit={handleSubmitAddNew}></AddLift>
    </>
  );
};

export default UserPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const sessionToken = getSessionToken(req);

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: 'demo@beleffort.app',
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
