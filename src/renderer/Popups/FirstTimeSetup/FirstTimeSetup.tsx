import TitleText from 'renderer/Texts/TitleText';
import MainButton from 'renderer/Buttons/MainButton/MainButton';
import './styles.css';
import MainText from 'renderer/Texts/MainText';
import Checkbox from 'renderer/Checkbox/Checkbox';
import { useState } from 'react';
import MinorText from 'renderer/Texts/MinorText';
import Divider from 'renderer/Divider/Divider';

type FirstTimeSetupProp = {
  closeSelf: () => void;
};

const IntroText = [
  "Refont is a simple tool to change Discord's font, on the fly and automatically as well.",
  "None of it's changes are permanent, and must be applied everytime Discord starts up.",
  'So, it may be useful to have Refont start when you boot up your computer.',
];

const FirstTimeSetup = ({ closeSelf }: FirstTimeSetupProp) => {
  const [startOnBootup, setStartOnBootup] = useState(false);
  const [minimizeOnStart, setMinimizeOnStart] = useState(false);
  const [applyAutomatically, setApplyAutomatically] = useState(false);

  const applyAndContinue = () => {
    window.electron.ipcRenderer.sendMessage('set-start-on-boot', [
      startOnBootup,
    ]);
    window.electron.ipcRenderer.sendMessage('set-start-minimized', [
      minimizeOnStart,
    ]);
    window.electron.ipcRenderer.sendMessage('set-automatically-apply-font', [
      applyAutomatically,
    ]);
    closeSelf();
  };

  return (
    <div className="PopupContainer">
      <div className="PopupTitlebar">
        <TitleText>Welcome to Refont!</TitleText>
      </div>
      {IntroText.map((text: string) => (
        <MainText>{text}</MainText>
      ))}
      <Divider />
      <MainText>You may configure Refont&apos;s behavior here:</MainText>
      <div className="PopupCheckboxContainer">
        <Checkbox
          checked={startOnBootup}
          onToggle={() => setStartOnBootup(!startOnBootup)}
        />
        <MainText>Start on boot up</MainText>
      </div>
      <div className="PopupCheckboxContainer">
        <Checkbox
          checked={minimizeOnStart}
          onToggle={() => setMinimizeOnStart(!minimizeOnStart)}
        />
        <MainText>Start minimized</MainText>
      </div>
      <div className="PopupCheckboxContainer">
        <Checkbox
          checked={applyAutomatically}
          onToggle={() => setApplyAutomatically(!applyAutomatically)}
        />
        <MainText>Automatically apply font when opened</MainText>
      </div>
      <MinorText muted>
        (You can always change these in the settings!)
      </MinorText>
      <div className="PopupBottomButtons">
        <MainButton label="Okay!" onClick={applyAndContinue} />
      </div>
    </div>
  );
};

export default FirstTimeSetup;
