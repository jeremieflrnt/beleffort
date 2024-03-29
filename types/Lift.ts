export type Set = {
  id: string;
  rep: number;
  weight: number;
  updatedAt: Date;
};
export type SetWithPercentage = Set & {
  percentage: number;
};

export type LiftRawFromDB = {
  id: string;
  movement: string;
  sets: Set[];
};

export class Lift {
  id: string;
  movement: string;
  sets: SetWithPercentage[];

  constructor(id: string, movement: string, sets: Set[]) {
    this.id = id;
    this.movement = movement;
    this.sets = [];
    sets.map((set) => {
      return this.sets.push({ ...set, percentage: getPercentage(set.rep, correspondingValue) });
    });
  }
}

type CorrespondingValue = {
  [key: number]: number;
};

const getPercentage = (rm: number, table: CorrespondingValue): number => table[rm] || 0;

const correspondingValue: CorrespondingValue = {
  1: 100,
  2: 95,
  3: 93,
  4: 90,
  5: 87,
  6: 85,
  7: 83,
  8: 80,
  9: 77,
  10: 75,
  11: 70,
  12: 67,
  13: 65,
};
