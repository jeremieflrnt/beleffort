import Modal from '@/components/ui/Modal';
import { Lift } from '@/types/Lift';
import { useReducer } from 'react';
import { isValidMovement, isValidReps, isValidWeight } from './AddLift';
import { FiX } from 'react-icons/fi';

type Props = {
  lift: Lift;
  open: boolean;
  onClose: () => void;
  onDelete: (data: string) => void;
  onSubmit: (data: Lift) => void;
};

type FormState = {
  value: { movement: string };
  isValid: {
    movement: boolean;
  };
};

type FormAction = {
  type: string;
  value?: string;
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
    case 'ON_BLUR_MOVEMENT': {
      return {
        value: { ...state.value },
        isValid: {
          ...state.isValid,
          movement: isValidMovement(action.value!),
        },
      };
    }
    case 'ON_CLOSE': {
      return {
        value: { movement: '' },
        isValid: {
          movement: true,
        },
      };
    }
    default: {
      return {
        value: { movement: '' },
        isValid: {
          movement: false,
        },
      };
    }
  }
};

const UpdateSet = (props: Props) => {
  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { movement: '' },
    isValid: {
      movement: true,
    },
  });

  const handleOnChangeMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_MOVEMENT', value: event.target.value });
  };

  const handleOnBlurMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_MOVEMENT', value: event.target.value });
  };

  const handleOnClickClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: 'ON_CLOSE' });

    props.onClose();
  };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.isValid.movement) {
      const res = await fetch('/api/lift/update-lift', {
        method: 'POST',
        body: JSON.stringify({ ...formState.value, id: props.lift.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 && res.ok) {
        const data = await res.json();
        props.onSubmit({ ...data });
        formState.value.movement = '';
        props.onClose();
      }
    }
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    const res = await fetch('/api/lift/delete-lift', {
      method: 'DELETE',
      body: JSON.stringify({ id: props.lift.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200 && res.ok) {
      const data = await res.json();
      props.onDelete(data.id);
      props.onClose();
    }
  };

  return (
    <Modal open={props.open}>
      <div className="flex justify-end">
        <button onClick={handleOnClickClose} className="btn-sm btn-circle btn right-6 top-6 text-end">
          <FiX />
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Update your Lift</h2>
          <form className="flex flex-col items-center" onSubmit={handleUpdate}>
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
          </form>
        </div>
      </div>
      <div className="modal-action justify-between">
        <button onClick={handleDelete} className="btn-ghost btn">
          Delete this lift
        </button>
        <button onClick={handleUpdate} className="btn-primary btn">
          Yay!
        </button>
      </div>
    </Modal>
  );
};

export default UpdateSet;

function roundToNearestIncrement(num: number, increment: number): number {
  return Math.round(num / increment) * increment;
}

function roundToNearest(num: number, increment: number = 0.1): number {
  return roundToNearestIncrement(num, increment);
}
