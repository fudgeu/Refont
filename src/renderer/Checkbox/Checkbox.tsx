import clsx from 'clsx';
import { useState } from 'react';
import MainText from 'renderer/Texts/MainText';
import CheckIcon from '../../../assets/check.svg';
import './styles.css';

type CheckboxProp = {
  disabled: boolean;
  checked: boolean;
  onToggle: () => void;
};

const Checkbox = ({ disabled, checked, onToggle }: CheckboxProp) => {
  return (
    <button
      className={clsx({
        Checkbox: true,
        CheckboxFilled: checked,
        CheckboxDisabled: disabled,
        CheckboxFilledDisabled: checked && disabled,
      })}
      type="button"
      onClick={onToggle}
    >
      <img
        src={CheckIcon}
        alt="Checkmark"
        className={clsx({
          CheckmarkIcon: true,
          CheckmarkIconUnchecked: !checked,
        })}
      />
    </button>
  );
};

export default Checkbox;
