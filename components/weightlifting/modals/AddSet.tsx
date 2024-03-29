import { Lift } from '@/types/Lift';
import { useSession } from 'next-auth/react';
import { useReducer, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { isValidReps, isValidWeight } from './AddLift';

type Props = {
  lift: Lift;
  onSubmit: (data: Lift & { rep: string }) => void;
};

type FormState = {
  value: { reps: string; weight: string };
  isValid: {
    reps: boolean;
    weight: boolean;
  };
};

type FormAction = {
  type: string;
  value?: string;
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'ON_CHANGE_REPS': {
      return {
        value: { ...state.value, reps: Number(action.value).toFixed().toString() },
        isValid: {
          ...state.isValid,
          reps: isValidReps(Number(action.value)),
        },
      };
    }
    case 'ON_BLUR_REPS': {
      return {
        value: { ...state.value, reps: Number(action.value) > 100 ? '100' : action.value! },
        isValid: {
          ...state.isValid,
          weight: isValidReps(Number(action.value)),
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
    case 'ON_BLUR_WEIGHT': {
      const roundedValue = action.value!.match(/^-?\d+(?:\.\d{0,2})?/);
      return {
        value: { ...state.value, weight: roundedValue ? roundedValue[0] : action.value! },
        isValid: {
          ...state.isValid,
          weight: isValidWeight(Number(action.value)),
        },
      };
    }
    case 'ON_CLOSE': {
      return {
        value: { reps: '', weight: '' },
        isValid: {
          reps: true,
          weight: true,
        },
      };
    }
    default: {
      return {
        value: { reps: '', weight: '' },
        isValid: {
          reps: false,
          weight: false,
        },
      };
    }
  }
};

const UpdateSet = (props: Props) => {
  const { data: session } = useSession();

  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { reps: '', weight: '' },
    isValid: {
      reps: true,
      weight: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => (document.getElementById('modal-add-set') as HTMLDialogElement).close();

  const handleOnChangeReps = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_REPS', value: event.target.value });
  };

  const handleOnBlurReps = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_REPS', value: event.target.value });
  };

  const handleOnChangeWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_WEIGHT', value: event.target.value });
  };

  const handleOnBlurWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_WEIGHT', value: event.target.value });
  };

  const handleOnClickClose = () => {
    dispatchForm({ type: 'ON_CLOSE' });

    onClose();
  };

  const handleOnClickUpdate = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let initInvalid = false;
    if (formState.value.reps === '') {
      dispatchForm({ type: 'ON_BLUR_REPS', value: formState.value.reps });
      initInvalid = true;
    }
    if (formState.value.weight === '') {
      dispatchForm({ type: 'ON_BLUR_WEIGHT', value: formState.value.weight });
      initInvalid = true;
    }

    if (!initInvalid && formState.isValid.reps && formState.isValid.weight) {
      setIsLoading((prev) => {
        return !prev;
      });
      const res = await fetch('/api/lift/add-set', {
        method: 'POST',
        body: JSON.stringify({ ...formState.value, id: props.lift.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if ([200, 201].includes(res.status) && res.ok) {
        setIsLoading((prev) => {
          return !prev;
        });
        const data = (await res.json()) as Lift;
        props.onSubmit({ ...data, rep: formState.value.reps });
        dispatchForm({ type: 'ON_CLOSE' });
        onClose();
      }
    }
  };

  return (
    <dialog id="modal-add-set" className="modal modal-bottom backdrop-blur-xs sm:modal-middle">
      <div className="modal-box">
        <div className="flex justify-end">
          <button onClick={handleOnClickClose} className="btn-sm btn-circle btn right-6 top-6 text-end">
            <FiX />
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Add a new set</h2>
            <form className="flex flex-col items-center" onSubmit={handleOnClickUpdate}>
              <div className="form-control w-full max-w-xs">
                <label htmlFor="reps" className="label">
                  <span className="label-text">Reps?</span>
                </label>
                <label className="input-group">
                  <input
                    id="reps"
                    type="number"
                    min="1"
                    max="100"
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
          <div className={`${!session ? 'tooltip-open tooltip' : ''}`} data-tip="Sign in!">
            <button onClick={handleOnClickUpdate} className="btn" disabled={isLoading || !session}>
              {isLoading && <span className="loading loading-dots loading-xs"></span>}
              {!isLoading && 'Yay!'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default UpdateSet;
