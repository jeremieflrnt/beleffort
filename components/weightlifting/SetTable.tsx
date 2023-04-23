import { SetWithPercentage } from '@/types/Lift';
import { useState } from 'react';

type Props = {
  movement: string;
  sets: SetWithPercentage[];
};

const SetTable = (props: Props) => {
  const [oneRm, setOneRm] = useState(props.sets.find((set) => set.rep === 1));

  return (
    <>
      <div className="">
        {oneRm && (
          <div className="flex items-baseline font-extrabold">
            <div className="text-2xl text-success sm:text-3xl md:text-4xl">{oneRm.weight}</div>
            <div className="text-xl sm:text-2xl md:text-3xl">kg</div>
          </div>
          // <Stats>
          //   <Stat title="1RM" value={`${oneRm.weight}kg`} desc="Jan 1st"></Stat>
          // </Stats>
        )}
        {!(oneRm && props.sets.length === 1) && (
          <div className="stats-like my-4 grid grid-flow-row grid-cols-[auto_auto] gap-3 p-2 shadow sm:grid-cols-3 lg:grid-cols-5">
            {props.sets.map((set, index) => {
              if (set.rep === 1) return;
              return (
                <div className="flex flex-col" key={props.movement + index}>
                  <div className="text-xs ">{set.rep}RM</div>
                  <div className="flex items-baseline font-extrabold">
                    <div className="text-lg">{set.weight}</div>
                    <div className="text-xs">kg</div>
                  </div>
                  {![0, 100].includes(set.percentage) && (
                    <div className="text-2xs">
                      {set.percentage}%{index === 1 && ' of 1RM'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SetTable;
