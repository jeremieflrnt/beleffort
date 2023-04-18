import LiftCard from './LiftCard';
import React from 'react';
import { Lift } from '@/types/Lift';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import slugify from 'slugify';

type Props = {
  lifts: Lift[];
};

const Lifts = (props: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSelected = (id: string) => {
    router.push(`/${slugify(session?.user?.name ? session?.user?.name : '/', { lower: true })}/lift/${id}`);
  };

  return (
    <>
      <div className="max-w-screen-lg columns-2 items-center justify-center gap-2 px-5 py-10">
        {props.lifts.map((lift) => {
          return <LiftCard key={lift.id} lift={lift} selected={handleSelected} />;
        })}
      </div>
    </>
  );
};

export default Lifts;
