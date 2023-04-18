import { Lift } from '@/types/Lift';
import { useReducer } from 'react';
import Modal from '../../ui/Modal';
import { FiX } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Lift[]) => void;
};

type FormState = {
  value: { isKg: boolean };
};

type FormAction = {
  type: string;
  value?: string;
};

const formReducer = (state: FormState, action: FormAction) => {
  console.log('state.value.isKg', state.value.isKg);
  switch (action.type) {
    case 'ON_SWITCH_KG': {
      return {
        value: { isKg: !state.value.isKg },
      };
    }
    default: {
      return {
        value: { isKg: true },
      };
    }
  }
};

const Settings = ({ open, onClose, onSubmit }: Props) => {
  const { data: session, status } = useSession();

  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { isKg: true },
  });

  const handleOnChange = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('event.target.value', event.target.value);
    dispatchForm({ type: 'ON_SWITCH_KG', value: event.target.value });
  };

  const handleOnClickClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatchForm({ type: 'ON_CLOSE' });
    onClose();
  };

  const handleOnClickSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('formState.value', formState.value);
    if (false) {
      const res = await fetch('/api/lift/add-lift', {
        method: 'POST',
        body: JSON.stringify({ ...formState.value, email: session?.user?.email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201 && res.ok) {
        const data = await res.json();
        onSubmit(data.lifts);
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
          <h2 className="card-title">Settings</h2>
          <form className="flex flex-col items-center">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text mr-4">Set weight to Kg</span>
                <input
                  type="checkbox"
                  className="toggle"
                  disabled
                  checked={formState.value.isKg}
                  onChange={handleOnChange}
                />
              </label>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-action">
        <button disabled onClick={handleOnClickSave} className="btn">
          Yay!
        </button>
      </div>
    </Modal>
  );
};

export default Settings;