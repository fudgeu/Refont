import React, { useState } from 'react';
import './Dropdown.css';

import DownChevron from '../../../assets/down_chevron.svg';
import DropdownContents from './DropdownContents';

export type DropdownProp = {
  items: DropdownItem[];
  selected: string;
  setSelected: (selected: string) => void;
};

const Dropdown = ({ items, selected, setSelected }: DropdownProp) => {
  const [isOpen, setOpen] = useState(false);
  const [isHidden, setHidden] = useState(true);
  const [isInTimeout, setInTimeout] = useState(false);

  const closeDropbox = () => {
    if (!isInTimeout) {
      setHidden(true);
      setTimeout(() => setOpen(false), 100);
    }
  };

  const handleClick = () => {
    if (!isOpen) {
      setHidden(false);
      setOpen(true);
      setInTimeout(true);
      setTimeout(() => setInTimeout(false), 50);
      return;
    }
    closeDropbox();
  };

  const generateChevronStyle = () => {
    if (!isHidden) {
      return {
        transform: 'rotate(180deg)',
      };
    }
    return {};
  };

  const generateDropdownStyle = () => {
    if (!isHidden) {
      return {
        borderColor: 'rgb(150, 150, 150)',
      };
    }
    return {};
  };

  return (
    <div>
      <button
        className="Dropdown"
        type="button"
        style={generateDropdownStyle()}
        onClick={handleClick}
      >
        <div className="DropdownTextContainer">
          <p>{items.filter((item) => item.id === selected)[0].label}</p>
        </div>
        <img
          className="DropdownChevron"
          style={generateChevronStyle()}
          alt="Chevron"
          src={DownChevron}
        />
      </button>
      <DropdownContents
        isHidden={isHidden}
        closeDropbox={closeDropbox}
        items={items}
        setSelected={setSelected}
      />
    </div>
  );
};

export default Dropdown;
