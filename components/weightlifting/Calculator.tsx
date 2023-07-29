type Props = {
  weight: number;
};

const Calculator = (props: Props) => {
  return (
    <>
      <div className="my-2 text-xl font-extrabold">Calculator</div>
      <div className="rounded-lg bg-base-100 drop-shadow-sm">
        <div className="flex max-w-fit flex-wrap justify-evenly rounded-lg bg-base-100 p-2 drop-shadow-sm">
          <div className="m-1 mr-2 flex min-w-[3rem] flex-col flex-wrap" key="90percent">
            <div className="flex-grow text-xs text-base-content text-opacity-60">90%</div>
            <div className="flex-grow-2 flex items-baseline font-extrabold">
              <div className="text-2xl">{(props.weight * 0.9).toFixed().toString()}</div>
              <div className="text-lg">kg</div>
            </div>
          </div>
          <div className="m-1 mr-2 flex min-w-[3rem] flex-col flex-wrap" key="80percent">
            <div className="flex-grow text-xs text-base-content text-opacity-60">80%</div>
            <div className="flex-grow-2 flex items-baseline font-extrabold">
              <div className="text-2xl">{(props.weight * 0.8).toFixed().toString()}</div>
              <div className="text-lg">kg</div>
            </div>
          </div>
          <div className="m-1 mr-2 flex min-w-[3rem] flex-col flex-wrap" key="70percent">
            <div className="flex-grow text-xs text-base-content text-opacity-60">70%</div>
            <div className="flex-grow-2 flex items-baseline font-extrabold">
              <div className="text-2xl">{(props.weight * 0.7).toFixed().toString()}</div>
              <div className="text-lg">kg</div>
            </div>
          </div>
          <div className="m-1 flex min-w-[3rem] flex-col flex-wrap" key="60percent">
            <div className="flex-grow text-xs text-base-content text-opacity-60">60%</div>
            <div className="flex-grow-2 flex items-baseline font-extrabold">
              <div className="text-2xl">{(props.weight * 0.6).toFixed().toString()}</div>
              <div className="text-lg">kg</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
