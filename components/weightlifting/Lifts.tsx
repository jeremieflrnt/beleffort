import { Lift } from '@/types/Lift';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import slugify from 'slugify';
import LiftCard from './LiftCard';

type Props = {
  lifts: Lift[];
};

const Lifts = (props: Props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSelected = (id: string) => {
    router.push(`/${slugify(session?.user?.name ? session?.user?.name : '/demo', { lower: true })}/lift/${id}`);
  };

  return (
    <>
      <div
        className={`max-w-screen-lg ${
          props.lifts.length === 1 ? '' : 'columns-2'
        } select-none items-center justify-center gap-4 px-5 py-10`}
      >
        {props.lifts.map((lift) => {
          if (lift.sets.length > 0) {
            return <LiftCard key={lift.id} lift={lift} selected={handleSelected} />;
          }
        })}
      </div>
    </>
  );
};

export default Lifts;
