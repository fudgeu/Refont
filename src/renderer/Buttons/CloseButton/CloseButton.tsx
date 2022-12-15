import React from 'react';
import './style.css';
import close from '../../../../assets/close.svg';

type CloseButtonProp = {
  handleClick: () => void;
};

const CloseButton = ({ handleClick }: CloseButtonProp) => {
  return (
    <button className="CloseButton" type="button" onClick={handleClick}>
      <img className="CloseButtonImg" alt="Close Button" src={close} />
    </button>
  );
};

export default CloseButton;
