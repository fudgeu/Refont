import clsx from 'clsx';
import React from 'react';
import MainText from 'renderer/Texts/MainText';
import './style.css';

type MainButtonProp = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

const MainButton = ({ label, disabled, onClick }: MainButtonProp) => {
  return (
    <button
      className={clsx({
        MainButton: true,
        MBDisabled: disabled,
        MBEnabled: !disabled,
      })}
      type="button"
      onClick={onClick}
    >
      <MainText>{label}</MainText>
    </button>
  );
};

MainButton.defaultProps = {
  disabled: false,
};

export default MainButton;
