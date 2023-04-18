type Props = {
  children: React.ReactNode;
};

const Stats = ({ children }: Props) => {
  return (
    <>
      <div className="stats stats-vertical shadow">{children}</div>
    </>
  );
};

export default Stats;
