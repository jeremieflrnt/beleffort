import { Lift } from '@/types/Lift';
import { useSession } from 'next-auth/react';
import { useReducer, useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { isValidMovement } from './AddLift';

type Props = {
  lift: Lift;
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
  const { data: session } = useSession();

  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { movement: '' },
    isValid: {
      movement: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => (document.getElementById('modal-update-lift') as HTMLDialogElement).close();

  const handleOnChangeMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_CHANGE_MOVEMENT', value: event.target.value });
  };

  const handleOnBlurMovement = (event: React.FocusEvent<HTMLInputElement>) => {
    dispatchForm({ type: 'ON_BLUR_MOVEMENT', value: event.target.value });
  };

  const handleOnClickClose = () => {
    dispatchForm({ type: 'ON_CLOSE' });
    onClose();
  };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let initInvalid = false;
    if (formState.value.movement === '') {
      dispatchForm({ type: 'ON_BLUR_MOVEMENT', value: formState.value.movement });
      initInvalid = true;
    }

    if (!initInvalid && formState.isValid.movement) {
      setIsLoading((prev) => {
        return !prev;
      });
      const res = await fetch('/api/lift/update-lift', {
        method: 'PUT',
        body: JSON.stringify({ ...formState.value, id: props.lift.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 && res.ok) {
        setIsLoading((prev) => {
          return !prev;
        });
        const data = (await res.json()) as Lift;
        props.onSubmit({ ...data });
        dispatchForm({ type: 'ON_CLOSE' });
        onClose();
      }
    }
  };

  const handleDelete = async () => {
    setIsLoading((prev) => {
      return !prev;
    });
    const res = await fetch('/api/lift/delete-lift', {
      method: 'DELETE',
      body: JSON.stringify({ id: props.lift.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200 && res.ok) {
      setIsLoading((prev) => {
        return !prev;
      });
      const data = (await res.json()) as Lift;
      props.onDelete(data.id);
      dispatchForm({ type: 'ON_CLOSE' });
      onClose();
    }
  };

  return (
    <dialog id="modal-update-lift" className="modal modal-bottom backdrop-blur-xs sm:modal-middle">
      <div className="modal-box">
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
          <div className={`${!session ? 'tooltip-open tooltip' : ''}`} data-tip="Sign in!">
            <button onClick={handleDelete} className="btn-ghost btn" disabled={isLoading || !session}>
              {isLoading && <span className="loading loading-dots loading-xs"></span>}
              {!isLoading && (
                <>
                  <FiTrash2 />
                  Delete this lift
                </>
              )}
            </button>
          </div>
          <div className={`${!session ? 'tooltip-open tooltip' : ''}`} data-tip="Sign in!">
            <button onClick={handleUpdate} className="btn" disabled={isLoading || !session}>
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
