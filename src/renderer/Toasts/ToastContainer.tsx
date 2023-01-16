import { useState } from 'react';
import Toast from './Toast';

type ToastContainerProp = {
  toastLabel: string;
};

const ToastContainer = ({ toastLabel }: ToastContainerProp) => {
  const [currentToast, setCurrentToast] = useState<string>();

  const generateToasts = () => {
    if (currentToast == null && toastLabel !== '') {
      setCurrentToast(toastLabel);
      return (
        <div>
          <Toast show label={toastLabel} />
        </div>
      );
    }

    if (currentToast != null && currentToast !== toastLabel) {
      return (
        <div>
          <Toast show={false} label={currentToast} />
          <Toast show label={toastLabel} />
        </div>
      );
    }

    if (currentToast != null) {
      return (
        <div>
          <Toast show label={currentToast} />
        </div>
      );
    }

    return {};
  };

  return generateToasts();
};

export default ToastContainer;
