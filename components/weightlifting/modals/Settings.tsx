import { Lift } from '@/types/Lift';
import { useReducer } from 'react';
import { FiX } from 'react-icons/fi';

type Props = {
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
    case 'ON_CLOSE': {
      return {
        value: { isKg: true },
      };
    }
    default: {
      return {
        value: { isKg: true },
      };
    }
  }
};

const Settings = (props: Props) => {
  const [formState, dispatchForm] = useReducer(formReducer, {
    value: { isKg: true },
  });

  const onClose = () => (document.getElementById('modal-settings') as HTMLDialogElement).close();

  const handleOnChange = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log('event.target.value', event.target.value);
    dispatchForm({ type: 'ON_SWITCH_KG', value: event.target.value });
  };

  const handleOnClickClose = () => {
    dispatchForm({ type: 'ON_CLOSE' });
    onClose();
  };

  const handleOnClickSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('formState.value', formState.value);
    // TODO
  };

  return (
    <dialog id="modal-settings" className="modal modal-bottom backdrop-blur-xs sm:modal-middle">
      <div className="modal-box">
        <div className="flex justify-end">
          <button onClick={handleOnClickClose} className="btn-sm btn-circle btn right-6 top-6 text-end">
            <FiX />
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">
              Settings
              <div className="badge badge-accent align-top text-xs">soon</div>
            </h2>
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
      </div>
    </dialog>
  );
};

export default Settings;
