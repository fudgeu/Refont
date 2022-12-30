import clsx from 'clsx';
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import CloseButton from 'renderer/Buttons/CloseButton/CloseButton';
import MainButton from 'renderer/Buttons/MainButton/MainButton';
import Checkbox from 'renderer/Checkbox/Checkbox';
import SearchBar from 'renderer/SearchBar/SearchBar';
import SelectionList from 'renderer/SelectionList/SelectionList';
import MainText from 'renderer/Texts/MainText';
import TitleText from 'renderer/Texts/TitleText';
import MessagePreview from './MessagePreview/MessagePreview';
import DiscordPFP from '../../../../assets/discordpfp.png';
import './style.css';

type FontSelectorProp = {
  fonts: string[];
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  closeSelf: () => void;
};

const FontSelector = ({
  fonts,
  selectedFont,
  setSelectedFont,
  closeSelf,
}: FontSelectorProp) => {
  const [filteredFonts, setFilteredFonts] = useState(fonts);
  const [selectedInList, setSelectedInList] = useState(selectedFont);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleSearch = (search: string) => {
    const filtered = fonts.filter((font) => {
      if (font.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }
      return false;
    });
    setFilteredFonts(filtered);
    if (filtered.length === 0) {
      setShowNoResults(true);
      return;
    }
    setShowNoResults(false);
  };

  const confirmSelection = () => {
    setSelectedFont(selectedInList);
    closeSelf();
  };

  const generateListItems = () => {
    return filteredFonts.map((font) => {
      return { label: font, id: font };
    });
  };

  const generateSelectionList = () => {
    if (showNoResults) {
      return (
        <div className="FSNoResultsContainer">
          <MainText>No results!</MainText>
        </div>
      );
    }
    return (
      <SelectionList
        items={generateListItems()}
        selected={selectedInList}
        setSelected={setSelectedInList}
      />
    );
  };

  const generateMessagePreview = () => {
    if (showPreview) {
      return (
        <div className="FSMessagePreview">
          <TitleText>Message Preview</TitleText>
          <div className="FSMessages">
            <MessagePreview
              icon="https://cdn.discordapp.com/avatars/239076520683896833/d2b1c2f4a9b11879b947df795d2052e3.webp?size=100"
              username="Rooty"
              timestamp="Yesterday at 6:52 PM"
              text="Amazingly few discotheques provide jukeboxes!"
              font={selectedInList}
            />
            <MessagePreview
              icon="https://www.pngkey.com/png/detail/67-676007_finger-pointing-at-screen-png-banner-royalty-free.png"
              username="You"
              timestamp="5 minutes ago"
              text="Wow"
              font={selectedInList}
            />
          </div>
        </div>
      );
    }
    return [];
  };

  return (
    <div className="FontSelectorGroupContainer">
      <div className="FontSelectorContainer">
        <div className="FSTitlebar">
          <TitleText>Font Selection</TitleText>
          <div className="FSCloseButton">
            <CloseButton handleClick={closeSelf} />
          </div>
        </div>
        <SearchBar handleSearch={handleSearch} />
        <div className="FontSelectionList">{generateSelectionList()}</div>
        <div className="FSBottomButtons">
          <Checkbox
            checked={showPreview}
            disabled={false}
            onToggle={() => {
              setShowPreview(!showPreview);
            }}
          />
          <MainText>Show preview</MainText>
          <div className="FSApplyFontContainer">
            <MainButton label="Select" onClick={confirmSelection} />
          </div>
        </div>
      </div>

      <CSSTransition
        in={showPreview}
        classNames="FSMessagePreviewContainer"
        timeout={200}
        appear
        unmountOnExit
      >
        <div className="FSMessagePreview">
          <TitleText>Message Preview</TitleText>
          <MessagePreview
            icon={DiscordPFP}
            username="Rooty"
            timestamp="Yesterday at 6:52 PM"
            text="Amazingly few discotheques provide jukeboxes!"
            font={selectedInList}
          />
          <MessagePreview
            icon={DiscordPFP}
            username="Rison"
            timestamp="5 minutes ago"
            text="Man."
            font={selectedInList}
          />
        </div>
      </CSSTransition>
    </div>
  );
};

export default FontSelector;

/*
<div
        className={clsx({
          FSMessagePreview: true,
          FSMessagePreviewHide: !showPreview,
        })}
      >
        <TitleText>Message Preview</TitleText>
        <div className="FSMessages">
          <MessagePreview
            icon="https://cdn.discordapp.com/avatars/239076520683896833/d2b1c2f4a9b11879b947df795d2052e3.webp?size=100"
            username="Rooty"
            timestamp="Yesterday at 6:52 PM"
            text="Amazingly few discotheques provide jukeboxes!"
            font={selectedInList}
          />
        </div>
      </div>
      */
