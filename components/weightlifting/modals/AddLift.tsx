import { Lift } from '@/types/Lift';
import { useSession } from 'next-auth/react';
import { useReducer, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from '../../ui/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Lift[]) => void;
};

type FormState = {
  value: { movement: string; reps: string; weight: string };
  isValid: {
    movement: boolean;
    reps: boolean;
    weight: boolean;
  };
};

type FormAction = {
  type: string;
  value?: string;
};

export const isValidMovement = (data: string) => {
  return data.length > 3;
};
export const isValidReps = (data: number) => {
  return data >= 1 && data <= 50 && Number.isInteger(data);
};
export const isValidWeight = (data: number) => {
  return data >= 1 && data <= 1000;
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'ON_CHANGE_MOVEMENT': {
      return {
        value: { ...state.value, movement: action.value! },
        isValid: {
          ...state.isValid,
          movement: isValidMovement(action.value!),
        },
      };
    }
    case 'ON_CHANGE_REPS': {
      return {
        value: { ...state.value, reps: Number(action.value).toFixed().toString() },
        isValid: {
          ...state.isValid,
          reps: isValidReps(Number(action.value)),
        },
      };
    }
    case 'ON_CHANGE_WEIGHT': {
      return {
        value: { ...state.value, weight: action.value! },
        isValid: {
          ...state.isValid,
          weight: isValidWeight(Number(action.value)),
        },
      };
    }
    case 'ON_BLUR_MOVEMENT': {
      return {
        value: { ...state.value },
        isValid: {
          ...state.isValid,
          movement: isValidMovement(action.value!),
        },
      };
    }
    case 'ON_BLUR_REPS': {
      return {
        value: { ...state.value, reps: Number(action.value) > 15 ? '15' : action.value! },
        isValid: {
          ...state.isValid,
          reps: isValidReps(Number(action.value)),
        },
      };
    }
    case 'ON_BLUR_WEIGHT': {
      return {
        value: { ...state.value, weight: roundToNearest(Number(action.value)).toString() },
        isValid: {
          ...state.isValid,
          weight: isValidWeight(Number(action.value)),
        },
      };
    }
    case 'ON_CLOSE': {
      return {
        value: { movement: '', reps: '', weight: '' },
        isValid: {
          movement: true,
          reps: true,
          weight: true,
        },
      };
    }
    default: {
      return {
        value: { movement: '', reps: '', weight: '' },
        isValid: {
          movement: false,
          reps: false,
          weight: false,
        },
      };
    }
  }
};

const AddLift = ({ open, onClose, onSubmit }: Props) => {
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { movement: '', reps: '', weight: '' },
    isValid: {
      movement: true,
      reps: true,
      weight: true,
    },
  });

  const handleOnChangeMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_MOVEMENT', value: event.target.value });
  };

  const handleOnChangeReps = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_REPS', value: event.target.value });
  };

  const handleOnChangeWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_WEIGHT', value: event.target.value });
  };

  const handleOnBlurMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_MOVEMENT', value: event.target.value });
  };

  const handleOnBlurReps = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_REPS', value: event.target.value });
  };

  const handleOnBlurWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_WEIGHT', value: event.target.value });
  };

  const handleOnClickClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: 'ON_CLOSE' });
    onClose();
  };

  const handleOnClickSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let initInvalid = false;
    if (formState.value.movement === '') {
      dispatchForm({ type: 'ON_BLUR_MOVEMENT', value: formState.value.movement });
      initInvalid = true;
    }
    if (formState.value.reps === '') {
      dispatchForm({ type: 'ON_BLUR_REPS', value: formState.value.reps });
      initInvalid = true;
    }
    if (formState.value.weight === '') {
      dispatchForm({ type: 'ON_BLUR_WEIGHT', value: formState.value.weight });
      initInvalid = true;
    }

    if (!initInvalid && formState.isValid.movement && formState.isValid.reps && formState.isValid.weight) {
      setIsLoading((prev) => {
        return !prev;
      });
      const res = await fetch('/api/lift/add-lift', {
        method: 'POST',
        body: JSON.stringify({ ...formState.value, email: session?.user?.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201 && res.ok) {
        setIsLoading((prev) => {
          return !prev;
        });
        const data = await res.json();
        onSubmit(data.lifts);
        dispatchForm({ type: 'ON_CLOSE' });
        onClose();
      }
    }
  };

  return (
    <Modal open={open}>
      <div className="flex justify-end">
        <button onClick={handleOnClickClose} className="btn-sm btn-circle btn right-6 top-6 text-end">
          <FiX />
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Add new Lift</h2>
          <form className="flex flex-col items-center">
            <div className="form-control w-full max-w-xs">
              <label htmlFor="movement" className="label">
                <span className="label-text">Movement?</span>
              </label>
              <input
                id="movement"
                type="text"
                placeholder="Deadlift, Clean & Jerk…"
                value={formState.value.movement}
                onChange={handleOnChangeMovement}
                onBlur={handleOnBlurMovement}
                className={`input-bordered input w-full max-w-xs ${formState.isValid.movement ? '' : 'input-error'}`}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label htmlFor="reps" className="label">
                <span className="label-text">Reps?</span>
              </label>
              <label className="input-group">
                <input
                  id="reps"
                  type="number"
                  min="1"
                  max="15"
                  step="1"
                  placeholder="1"
                  value={formState.value.reps}
                  onChange={handleOnChangeReps}
                  onBlur={handleOnBlurReps}
                  className={`input-bordered input w-full max-w-xs ${formState.isValid.reps ? '' : 'input-error'}`}
                />
                <span>RM</span>
              </label>
            </div>
            <div className="form-control w-full max-w-xs">
              <label htmlFor="weight" className="label">
                <span className="label-text">Weight?</span>
              </label>
              <label className="input-group">
                <input
                  id="weight"
                  type="number"
                  min="1"
                  max="1000"
                  step="0.1"
                  placeholder="100"
                  value={formState.value.weight}
                  onChange={handleOnChangeWeight}
                  onBlur={handleOnBlurWeight}
                  className={`input-bordered input w-full max-w-xs ${formState.isValid.weight ? '' : 'input-error'}`}
                />
                <span>Kg</span>
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-action">
        <button onClick={handleOnClickSave} className="btn">
          {isLoading && <span className="loading-dots loading-xs loading"></span>}
          {!isLoading && 'Yay!'}
        </button>
      </div>
    </Modal>
  );
};

export default AddLift;

function roundToNearestIncrement(num: number, increment: number): number {
  return Math.round(num / increment) * increment;
}

function roundToNearest(num: number, increment: number = 0.1): number {
  return roundToNearestIncrement(num, increment);
}
