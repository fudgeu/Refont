import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import FontSelector from 'renderer/Popups/FontSelector/FontSelector';
import './style.css';

type PopupProviderProp = {
  children?: React.ReactNode;
  show: boolean;
};

const PopupProvider = ({ children, show }: PopupProviderProp) => {
  const [disabled, setDisabled] = useState(false);

  // completely hide/show self after change in visibility
  useEffect(() => {
    if (show) {
      setDisabled(false);
      return;
    }
    setTimeout(() => {
      setDisabled(true);
    }, 100);
  }, [show]);

  return (
    <div
      className={clsx({
        PopupBackground: true,
        PopupBackgroundShow: show,
        Disabled: disabled,
      })}
    >
      <div
        className={clsx({
          PopupContent: true,
          PopupContentShow: show,
        })}
      >
        {children}
      </div>
    </div>
  );
};

PopupProvider.defaultProps = {
  children: [],
};

export default PopupProvider;
