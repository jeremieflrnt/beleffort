import Modal from '@/components/ui/Modal';
import { Set, SetWithPercentage } from '@/types/Lift';
import { useReducer } from 'react';
import { isValidWeight } from './AddLift';
import { FiX } from 'react-icons/fi';

type Props = {
  rm: SetWithPercentage;
  open: boolean;
  onClose: () => void;
  onDelete: (data: string) => void;
  onSubmit: (data: Set) => void;
};

type FormState = {
  value: { weight: string };
  isValid: {
    weight: boolean;
  };
};

type FormAction = {
  type: string;
  value?: string;
};

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
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
        value: { weight: '' },
        isValid: {
          weight: true,
        },
      };
    }
    default: {
      return {
        value: { weight: '' },
        isValid: {
          weight: false,
        },
      };
    }
  }
};

const UpdateSet = (props: Props) => {
  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { weight: '' },
    isValid: {
      weight: true,
    },
  });

  const handleOnChangeWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_WEIGHT', value: event.target.value });
  };

  const handleOnBlurWeight = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_WEIGHT', value: event.target.value });
  };

  const handleOnClickClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: 'ON_CLOSE' });
    props.onClose();
  };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.isValid.weight) {
      const res = await fetch('/api/lift/update-set', {
        method: 'PUT',
        body: JSON.stringify({ ...formState.value, id: props.rm.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 && res.ok) {
        formState.value.weight = '';
        const data = await res.json();
        props.onSubmit(data);
        props.onClose();
      }
    }
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const res = await fetch('/api/lift/delete-set', {
      method: 'DELETE',
      body: JSON.stringify({ id: props.rm.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200 && res.ok) {
      formState.value.weight = '';
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
          <h2 className="card-title">Update your {props.rm.rep}RM</h2>
          <form className="flex flex-col items-center" onSubmit={handleUpdate}>
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
      <div className="modal-action justify-between">
        <button onClick={handleDelete} className="btn-ghost btn">
          Delete this set
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