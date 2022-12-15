import React from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import clsx from 'clsx';
import DropdownItemComponent from './DropdownItem';

type DropdownContentsProp = {
  isHidden: boolean;
  closeDropbox: () => void;
  items: DropdownItem[];
  setSelected: (selected: string) => void;
};

const DropdownContents = ({
  isHidden,
  closeDropbox,
  items,
  setSelected,
}: DropdownContentsProp) => {
  const ref = useDetectClickOutside({
    onTriggered: closeDropbox,
  });

  function createDropdownItem(item: DropdownItem) {
    return (
      <DropdownItemComponent
        item={item}
        setSelected={setSelected}
        closeDropbox={closeDropbox}
      />
    );
  }

  function createDropdownItems() {
    return items.map(createDropdownItem);
  }

  return (
    <div
      ref={ref}
      className={clsx({
        DropdownContents: true,
        DropdownContentsHidden: isHidden,
      })}
    >
      {createDropdownItems()}
    </div>
  );
};

export default DropdownContents;
