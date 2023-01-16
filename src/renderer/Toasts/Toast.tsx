import MainText from 'renderer/Texts/MainText';
import { CSSTransition } from 'react-transition-group';
import './styles.css';
import Checkbox from 'renderer/Checkbox/Checkbox';
import { useState } from 'react';
import MainButton from 'renderer/Buttons/MainButton/MainButton';

type ToastProp = {
  label: string;
  show: boolean;
  destroySelf: () => void;
};

const Toast = ({ label, show, destroySelf }: ToastProp) => {
  return (
    <div>
      <CSSTransition
        in={show}
        appear
        timeout={200}
        onExited={destroySelf}
        unmountOnExit
        classNames="ToastTransition"
      >
        <div className="Toast">
          <MainText>{label}</MainText>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Toast;
