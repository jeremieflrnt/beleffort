import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children?: React.ReactNode;
  selector: string;
};

const ClientOnlyPortal: React.FC<Props> = (props) => {
  const ref = useRef<Element>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = document.querySelector(props.selector);
    if (element) {
      ref.current = element;
      setMounted(true);
    }
  }, [props.selector]);

  return mounted ? createPortal(props.children, ref.current!) : null;
};

export default ClientOnlyPortal;
