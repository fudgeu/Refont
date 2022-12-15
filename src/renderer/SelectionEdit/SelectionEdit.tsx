import React from 'react';
import MainText from 'renderer/Texts/MainText';
import './style.css';
import EditIcon from '../../../assets/edit.svg';

type SelectionEditProp = {
  label: string;
  handleClick: () => void;
};

const SelectionEdit = ({ label, handleClick }: SelectionEditProp) => {
  return (
    <button className="SelectionEditButton" type="button" onClick={handleClick}>
      <MainText>{label}</MainText>
      <img className="SelectionEditIcon" alt="Edit Icon" src={EditIcon} />
    </button>
  );
};

export default SelectionEdit;
