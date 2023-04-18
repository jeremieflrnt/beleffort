import { useState } from 'react';

type Props = {
  title?: string;
  value: string;
  desc: string;
  reminder?: string;
  Svg?: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
};

const Stat = (props: Props) => {
  const [tooltip, setTooltip] = useState(false);

  const handleOnClickForTooltip = () => {
    setTooltip((prev) => {
      return !prev;
    });
  };

  return (
    <>
      <div className="stat">
        {props.Svg && props.tooltip && (
          <div className="stat-figure cursor-pointer text-secondary" onClick={handleOnClickForTooltip}>
            {props.Svg}
          </div>
        )}
        {props.Svg && !props.tooltip && props.onClick && (
          <div className="stat-figure cursor-pointer text-secondary" onClick={props.onClick}>
            {props.Svg}
          </div>
        )}
        {props.Svg && !props.tooltip && !props.onClick && <div className="stat-figure text-secondary">{props.Svg}</div>}
        {props.title && <div className="stat-title">{props.title}</div>}
        <div className="stat-value">{props.value}</div>
        <div className="stat-desc">{props.desc}</div>
        {props.reminder && <div className="stat-desc pt-1 text-info">{props.reminder}</div>}
        {tooltip && <div className="stat-desc whitespace-pre-line pt-1 text-secondary">{props.tooltip}</div>}
      </div>
    </>
  );
};

export default Stat;
