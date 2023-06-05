import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: React.ReactNode;
  open?: boolean;
};

const Backdrop = () => {
  return <div className="opacity-50 blur-sm" />;
};

const ModalOverlay = ({ children }: Props) => {
  return (
    <div className="modal modal-open modal-bottom select-none backdrop-blur-xs sm:modal-middle">
      <div className="modal-box relative w-11/12 ">{children}</div>
    </div>
  );
};

const Modal = ({ children, open }: Props) => {
  return (
    <>
      {/* <ClientOnlyPortal selector="#backdrop">
        <Backdrop />
      </ClientOnlyPortal>
      <ClientOnlyPortal selector="#overlay">
        <ModalOverlay open={open}>{children}</ModalOverlay>
      </ClientOnlyPortal> */}
      {/* {open && createPortal(<Backdrop />, document.getElementById('backdrop') as HTMLElement)} */}
      {open && createPortal(<ModalOverlay>{children}</ModalOverlay>, document.getElementById('overlay') as HTMLElement)}
    </>
  );
};

export default Modal;
