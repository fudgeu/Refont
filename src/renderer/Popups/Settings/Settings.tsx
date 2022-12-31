import { useEffect, useState } from 'react';
import CloseButton from 'renderer/Buttons/CloseButton/CloseButton';
import MainButton from 'renderer/Buttons/MainButton/MainButton';
import LongSpanCheckbox from 'renderer/Checkbox/CheckboxLayouts/LongSpanCheckbox';
import MinorText from 'renderer/Texts/MinorText';
import TitleText from 'renderer/Texts/TitleText';
import './styles.css';

type SettingsProp = {
  closeSelf: () => void;
};

const Settings = ({ closeSelf }: SettingsProp) => {
  const [startOnLaunch, setStartOnLaunch] = useState(false);
  const [startMinimized, setStartMinimized] = useState(false);
  const [applyAutomatically, setApplyAutomatically] = useState(false);

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

    window.electron.ipcRenderer.on('retrieved-start-minimized', (args) => {
      const startMinimizedArg: boolean = (args as boolean[])[0];
      setStartMinimized(startMinimizedArg);
    });

    window.electron.ipcRenderer.on(
      'retrieved-automatically-apply-font',
      (args) => {
        const applyAutomaticallArg: boolean = (args as boolean[])[0];
        setApplyAutomatically(applyAutomaticallArg);
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners('retrieved-start-on-boot');
      window.electron.ipcRenderer.removeAllListeners('updated-start-on-boot');
      // eslint-disable-next-line prettier/prettier
      window.electron.ipcRenderer.removeAllListeners('retrieved-start-minimized');
      // eslint-disable-next-line prettier/prettier
      window.electron.ipcRenderer.removeAllListeners('retrieved-automatically-apply-font');
    };
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-start-on-boot', []);
    window.electron.ipcRenderer.sendMessage('get-start-minimized', []);
    window.electron.ipcRenderer.sendMessage('get-automatically-apply-font', []);
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
          <LongSpanCheckbox
            label="Start on boot up"
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
          <LongSpanCheckbox
            label="Start minimized"
            checked={startMinimized}
            onToggle={() => {
              setStartMinimized(!startMinimized);
              window.electron.ipcRenderer.sendMessage('set-start-minimized', [
                !startMinimized,
              ]);
            }}
          />
          <LongSpanCheckbox
            label="Automatically apply font when opened"
            checked={applyAutomatically}
            onToggle={() => {
              setApplyAutomatically(!applyAutomatically);
              window.electron.ipcRenderer.sendMessage(
                'set-automatically-apply-font',
                [!applyAutomatically]
              );
            }}
          />
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
