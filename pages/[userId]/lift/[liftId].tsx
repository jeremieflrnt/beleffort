import Stat from '@/components/ui/Stat';
import Stats from '@/components/ui/Stats';
import Calculator from '@/components/weightlifting/Calculator';
import SetTabs from '@/components/weightlifting/SetTabs';
import AddSet from '@/components/weightlifting/modals/AddSet';
import UpdateLift from '@/components/weightlifting/modals/UpdateLift';
import UpdateSet from '@/components/weightlifting/modals/UpdateSet';
import { getSessionToken } from '@/lib/utils';
import { Lift, Set, SetWithPercentage } from '@/types/Lift';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiInfo } from 'react-icons/fi';
import { RiArrowGoBackLine } from 'react-icons/ri';
import prisma from '../../../lib/prisma';

type Props = {
  lift: Lift;
  oneRm?: Set;
  user: string;
};

const LiftPage = (props: Props) => {
  const [activeRep, setActiveRep] = useState(props.oneRm ? { ...props.oneRm, percentage: 100 } : props.lift.sets[0]);
  const [lift, setLift] = useState(props.lift);
  const [oneRm, setOneRm] = useState(props.oneRm);
  const router = useRouter();

  const title = 'BelEffort - ' + lift.movement;

  const handleClickTab = (rm: SetWithPercentage) => {
    setActiveRep({ ...rm });
  };

  const handleToggleModalUpdateSet = () =>
    (document.getElementById('modal-update-set') as HTMLDialogElement)!.showModal();

  const handleToggleModalAddSet = () => (document.getElementById('modal-add-set') as HTMLDialogElement)!.showModal();

  const handleToggleModalUpdateLift = () =>
    (document.getElementById('modal-update-lift') as HTMLDialogElement)!.showModal();

  const handleDeleteLift = async () => {
    await router.push(`/${router.query.userId as string}`);
  };

  const handleUpdateLift = (data: Lift) => {
    setLift({ ...data });
  };

  const handleUpdateSet = (data: Set) => {
    setActiveRep((prev) => {
      return { ...prev, weight: data.weight, updatedAt: data.updatedAt };
    });
    setLift((prev) => {
      const updatedSets = prev.sets.map((set) => {
        if (set.id === activeRep.id) return { ...set, weight: data.weight };
        else return set;
      });
      return {
        ...prev,
        sets: [...updatedSets],
      };
    });
    if (activeRep.rep === 1) {
      setOneRm((prev) => {
        if (prev) {
          return { ...prev, weight: data.weight };
        } else return { ...data };
      });
    }
  };

  const handleAddSet = (data: Lift & { rep: string }) => {
    const createdSet = data.sets.find((set) => set.rep === Number(data.rep));
    if (createdSet) setActiveRep({ ...createdSet });
    setLift(data);
  };

  const handleDeleteSet = (data: string) => {
    setLift((prev) => {
      if (prev.sets.length === 1) {
        router.push(`/${router.query.userId as string}`).then(
          () => {},
          () => {},
        );
      }
      const updatedSets = prev.sets.filter((set) => set.id !== data);
      return {
        ...prev,
        sets: [...updatedSets],
      };
    });
    setActiveRep({
      ...lift.sets[0],
    });
  };

  const [detailedInfos, setDetailedInfos] = useState({
    theoryPercentageOfOneRm: '',
    theoryWeightOfOneRm: '',
    actualPercentageOfOneRm: '',
    reminderToUpdate: '',
  });

  useEffect(() => {
    if (activeRep.percentage > 0 && activeRep.percentage < 100) {
      setDetailedInfos((prev) => {
        return {
          ...prev,
          theoryPercentageOfOneRm: activeRep.percentage.toString(),
          theoryWeightOfOneRm: (activeRep.weight / (activeRep.percentage / 100)).toFixed(0),
        };
      });
    }
    if (oneRm) {
      setDetailedInfos((prev) => {
        const percentageOfRecorded = (Number(prev.theoryWeightOfOneRm) / oneRm.weight) * 100;
        if (percentageOfRecorded > 120)
          return {
            ...prev,
            actualPercentageOfOneRm: percentageOfRecorded.toFixed(0),
            reminderToUpdate: 'You should update your 1RM',
          };
        else if (percentageOfRecorded < 80)
          return {
            ...prev,
            actualPercentageOfOneRm: percentageOfRecorded.toFixed(0),
            reminderToUpdate: `You should update your ${activeRep.rep}RM`,
          };
        else
          return {
            ...prev,
            actualPercentageOfOneRm: percentageOfRecorded.toFixed(0),
            reminderToUpdate: '',
          };
      });
    }
  }, [activeRep.percentage, activeRep.rep, activeRep.weight, oneRm]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="My performance tracked and easily reach! Gain access to your full potential"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="card w-fit max-w-screen-lg select-none break-inside-avoid-column bg-transparent sm:card-normal md:shadow-xl">
        <div className="card-body">
          <div className="card-title justify-between">
            <div className="cursor-pointer text-5xl font-extrabold" onClick={handleToggleModalUpdateLift}>
              {lift.movement}
            </div>
          </div>

          <SetTabs
            activeRepId={activeRep.id}
            sets={lift.sets}
            onClickTab={handleClickTab}
            onClickNewTab={handleToggleModalAddSet}
          />

          <div className="text-xl font-extrabold">{activeRep.rep}RM</div>
          <Stats>
            <Stat
              value={`${activeRep.weight}kg`}
              desc={new Date(activeRep.updatedAt).toDateString()}
              Svg={<AiOutlineEdit size="2em" />}
              onClick={handleToggleModalUpdateSet}
            ></Stat>
          </Stats>

          {![0, 100].includes(activeRep.percentage) && oneRm && (
            <>
              <div className="text-xl font-extrabold">1RM</div>
              <Stats>
                <Stat title="Recorded" value={`${oneRm.weight}kg`} desc={new Date(oneRm.updatedAt).toDateString()} />
                <Stat
                  title="Theory"
                  value={`${detailedInfos.theoryWeightOfOneRm}kg`}
                  desc={`${detailedInfos.actualPercentageOfOneRm}% of recorded 1RM`}
                  reminder={`${detailedInfos.reminderToUpdate}`}
                  Svg={<FiInfo size="2em" />}
                  tooltip={`${activeRep.rep}RM is ${activeRep.percentage}% of 1RM\nYour 1RM should be ${detailedInfos.theoryWeightOfOneRm}kg`}
                />
              </Stats>
            </>
          )}
          {activeRep.percentage === 100 && <Calculator weight={activeRep.weight} />}
        </div>
      </div>
      <Link className="btn-circle btn mt-4 text-base md:mt-8" href={`/${props.user}`}>
        <RiArrowGoBackLine size={'2em'} />
      </Link>
      <UpdateSet rm={activeRep} onDelete={handleDeleteSet} onSubmit={handleUpdateSet}></UpdateSet>
      <AddSet lift={lift} onSubmit={handleAddSet}></AddSet>
      <UpdateLift lift={lift} onDelete={handleDeleteLift} onSubmit={handleUpdateLift}></UpdateLift>
    </>
  );
};

export default LiftPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req } = context;
  const sessionToken = getSessionToken(req);

  if (!params?.liftId || (!sessionToken && params.userId !== 'demo'))
    return {
      notFound: true,
    };

  const userIdSession = await prisma.session.findFirst({
    where: {
      sessionToken: sessionToken,
    },
    select: {
      userId: true,
    },
  });

  const lift = await prisma.lift.findUnique({
    where: { id: params.liftId as string },
    select: {
      id: true,
      movement: true,
      ownerId: true,
      sets: {
        orderBy: { rep: 'asc' },
        select: {
          id: true,
          rep: true,
          weight: true,
          updatedAt: true,
        },
      },
    },
  });

  if (lift && userIdSession !== lift?.ownerId && lift.sets.length > 0) {
    if (lift.sets[0].rep === 1)
      return {
        props: {
          lift: JSON.parse(JSON.stringify(new Lift(lift.id, lift.movement, lift.sets))) as Lift,
          oneRm: JSON.parse(JSON.stringify(lift.sets[0])) as Set,
          user: params.userId,
        },
      };
    else
      return {
        props: {
          lift: JSON.parse(JSON.stringify(new Lift(lift.id, lift.movement, lift.sets))) as Lift,
          user: params.userId,
        },
      };
  } else
    return {
      notFound: true,
    };
}
