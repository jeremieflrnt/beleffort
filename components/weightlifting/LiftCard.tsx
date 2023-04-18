import { Lift } from '@/types/Lift';
import SetTable from './SetTable';

type Props = {
  lift: Lift;
  selected: (id: string) => void;
};

const LiftCard = (props: Props) => {
  const handleOnClick = () => {
    props.selected(props.lift.id);
  };

  return (
    <div
      className="card card-compact my-4 w-full cursor-pointer break-inside-avoid-column bg-transparent shadow-xl sm:card-normal"
      onClick={handleOnClick}
    >
      <div className="card-body">
        <h2 className="card-title text-xl font-extrabold sm:text-4xl">{props.lift.movement}</h2>
        <SetTable movement={props.lift.movement} sets={props.lift.sets} />
      </div>
    </div>
  );
};

export default LiftCard;
