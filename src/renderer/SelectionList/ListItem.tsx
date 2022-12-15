import clsx from 'clsx';
import React from 'react';
import MainText from 'renderer/Texts/MainText';

type ListItemProp = {
  itemTemplate: ListItemTemplate;
  selected: boolean;
  setSelected: (selected: string) => void;
};

const ListItem = ({ itemTemplate, selected, setSelected }: ListItemProp) => {
  const handleClick = () => {
    setSelected(itemTemplate.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx({
        ListItem: true,
        ListItemSelected: selected,
      })}
    >
      <MainText>{itemTemplate.label}</MainText>
    </button>
  );
};

export default ListItem;
