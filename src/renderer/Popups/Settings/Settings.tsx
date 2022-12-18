import { useEffect, useState } from 'react';
import CloseButton from 'renderer/Buttons/CloseButton/CloseButton';
import MainButton from 'renderer/Buttons/MainButton/MainButton';
import Checkbox from 'renderer/Checkbox/Checkbox';
import MainText from 'renderer/Texts/MainText';
import MinorText from 'renderer/Texts/MinorText';
import TitleText from 'renderer/Texts/TitleText';
import './styles.css';

type SettingsProp = {
  closeSelf: () => void;
};

const Settings = ({ closeSelf }: SettingsProp) => {
  const [startOnLaunch, setStartOnLaunch] = useState(false);

  // ipc listeners
  useEffect(() => {
    window.electron.ipcRenderer.on('retrieved-start-on-boot', (args) => {
      const startOnBoot: boolean = (args as boolean[])[0];
      setStartOnLaunch(startOnBoot);
    });

    window.electron.ipcRenderer.on('updated-start-on-boot', (args) => {
      const startOnBoot: boolean = (args as boolean[])[0];
      setStartOnLaunch(startOnBoot);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('retrieved-start-on-boot');
      window.electron.ipcRenderer.removeAllListeners('updated-start-on-boot');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-start-on-boot', []);
  }, []);

  return (
    <div className="PopupContainer">
      <div className="PopupTitlebar">
        <TitleText>Settings</TitleText>
        <div className="PopupCloseButton">
          <CloseButton handleClick={closeSelf} />
        </div>
      </div>
      <div className="SettingsContent">
        <div className="SettingsCheckboxContainer">
          <MainText>Start on boot up</MainText>
          <Checkbox
            disabled={false}
            checked={startOnLaunch}
            onToggle={() => {
              // update local value right now, then value will be confirmed via an IPC message sent later
              setStartOnLaunch(!startOnLaunch);
              window.electron.ipcRenderer.sendMessage('set-start-on-boot', [
                !startOnLaunch,
              ]);
            }}
          />
          <MainText>Start minimized</MainText>
          <Checkbox checked={startOnLaunch} onToggle={() => {}} />
        </div>
      </div>
      <div className="PopupBottomButtons">
        <div className="SettingsAppInfo">
          <MinorText muted>Refont v1.0.0</MinorText>
          <MinorText muted>Created by Fudgeu</MinorText>
        </div>
        <MainButton label="Close" onClick={closeSelf} />
      </div>
    </div>
  );
};

export default Settings;
