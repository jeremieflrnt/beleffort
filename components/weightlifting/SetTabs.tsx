import { SetWithPercentage } from '@/types/Lift';
import { FiEdit, FiPlus } from 'react-icons/fi';

type Props = {
  activeRepId: string;
  sets: SetWithPercentage[];
  onClickTab: (rm: SetWithPercentage) => void;
  onClickNewTab: () => void;
};

const SetTabs = (props: Props) => {
  return (
    <div className="tabs tabs-boxed m-4 justify-center">
      {props.sets.map((set) => {
        return (
          <a
            key={set.id}
            className={`tab ${set.id === props.activeRepId ? 'tab-active' : ''}`}
            onClick={props.onClickTab.bind(null, set)}
          >
            {set.rep}RM
          </a>
        );
      })}
      <a className={`tab`} onClick={props.onClickNewTab}>
        <FiPlus />
      </a>
      {/* <a className={`tab`} onClick={props.onClickNewTab}>
        <FiEdit />
      </a> */}
    </div>
  );
};

export default SetTabs;
