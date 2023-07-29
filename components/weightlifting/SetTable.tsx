import { SetWithPercentage } from '@/types/Lift';

type Props = {
  movement: string;
  sets: SetWithPercentage[];
};

const SetTable = (props: Props) => {
  const oneRm = props.sets.find((set) => set.rep === 1);
  return (
    <>
      <div className="">
        {oneRm && (
          <div className="flex items-baseline font-extrabold">
            <div className="text-2xl text-success sm:text-3xl md:text-4xl">{oneRm.weight}</div>
            <div className="text-xl sm:text-2xl md:text-3xl">kg</div>
          </div>
        )}
        {!(oneRm && props.sets.length === 1) && (
          <div className="my-4 rounded-lg bg-base-100 drop-shadow-sm">
            <div className="flex max-w-fit flex-wrap justify-evenly p-2">
              {props.sets.map((set, index) => {
                if (set.rep === 1) return;
                return (
                  <div className="m-1 flex min-w-[3rem] flex-col flex-wrap" key={props.movement + index}>
                    <div className="flex-grow text-xs">{set.rep}RM</div>
                    <div className="flex-grow-2 flex items-baseline font-extrabold">
                      <div className="text-lg">{set.weight}</div>
                      <div className="text-xs">kg</div>
                    </div>
                    {![0, 100].includes(set.percentage) && (
                      <div className="flex-grow text-2xs text-base-content text-opacity-60">
                        {set.percentage}%{index === 0 && ' of 1RM'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SetTable;
