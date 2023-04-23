type Props = {
  weight: number;
};

const Calculator = (props: Props) => {
  return (
    <>
      <div className="text-xl font-extrabold">Calculator</div>
      <div className="stats-like grid grid-flow-row grid-cols-[auto_auto] gap-3 p-2 shadow sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col">
          <div className="text-xs ">90%</div>
          <div className="flex items-baseline font-extrabold text-neutral">
            <div className="text-lg">{(props.weight * 0.9).toFixed().toString()}</div>
            <div className="text-xs">kg</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs ">80%</div>
          <div className="flex items-baseline font-extrabold text-neutral">
            <div className="text-lg">{(props.weight * 0.8).toFixed().toString()}</div>
            <div className="text-xs">kg</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs ">70%</div>
          <div className="flex items-baseline font-extrabold text-neutral">
            <div className="text-lg">{(props.weight * 0.7).toFixed().toString()}</div>
            <div className="text-xs">kg</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs ">60%</div>
          <div className="flex items-baseline font-extrabold text-neutral">
            <div className="text-lg">{(props.weight * 0.6).toFixed().toString()}</div>
            <div className="text-xs">kg</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
