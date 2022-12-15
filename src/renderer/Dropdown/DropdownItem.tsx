import React from 'react';

const DropdownItemComponent = ({
  item,
  setSelected,
  closeDropbox,
}: DropdownItemProp) => {
  const handleClick = () => {
    setSelected(item.id);
    closeDropbox();
  };

  return (
    <button type="button" className="DropdownItem" onClick={handleClick}>
      <p className="DropdownItemText">{item.label}</p>
    </button>
  );
};

export default DropdownItemComponent;
