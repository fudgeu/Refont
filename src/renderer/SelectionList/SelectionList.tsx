/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import ListItem from './ListItem';
import './style.css';

type SelectionListProp = {
  items: ListItemTemplate[];
  selected: string;
  setSelected: (selected: string) => void;
};

const SelectionList = ({ items, selected, setSelected }: SelectionListProp) => {
  const generateItems = () => {
    return items.map((item) => {
      return (
        <ListItem
          key={item.id}
          itemTemplate={item}
          selected={item.id === selected}
          setSelected={setSelected}
        />
      );
    });
  };

  return (
    <Scrollbars
      renderTrackVertical={(props) => (
        <div {...props} className="ScrollbarVerticalTrack" />
      )}
      renderThumbVertical={(props) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div {...props} className="ScrollbarVerticalThumb" />
      )}
    >
      <div className="SelectionListContainer">{generateItems()}</div>
    </Scrollbars>
  );
};

export default SelectionList;
