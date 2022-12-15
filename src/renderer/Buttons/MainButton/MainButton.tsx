import React from 'react';
import MainText from 'renderer/Texts/MainText';
import './style.css';

type MainButtonProp = {
  label: string;
  onClick: () => void;
};

const MainButton = ({ label, onClick }: MainButtonProp) => {
  return (
    <button className="MainButton" type="button" onClick={onClick}>
      <MainText>{label}</MainText>
    </button>
  );
};

export default MainButton;
