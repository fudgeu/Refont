import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './Popups/PopupStyles.css';
import MainButton from './Buttons/MainButton/MainButton';
import DiscordStatus from './DiscordStatus/DiscordStatus';
import FontSelector from './Popups/FontSelector/FontSelector';
import PopupProvider from './PopupProvider/PopupProvider';
import SelectionEdit from './SelectionEdit/SelectionEdit';
import Settings from './Popups/Settings/Settings';
import SettingsIcon from '../../assets/settings.svg';
import ResetIcon from '../../assets/retry.svg';
import IconButton from './Buttons/IconButton/IconButton';
import AppTitleText from './Texts/AppTitleText';
import FirstTimeSetup from './Popups/FirstTimeSetup/FirstTimeSetup';
import Toast from './Toasts/Toast';

const Hello = () => {
  const [websocketStatus, setWebsocketStatus] = useState('disconnected');
  const [websocketRetries, setWebsocketRetries] = useState(0);
  const [selectedFont, setSelectedFont] = useState('Comic Sans MS');
  const [fonts, setFonts] = useState<string[]>(['Comic Sans MS']);

  // toasts
  const [activeToasts, setActiveToasts] = useState<Map<string, ToastTemplate>>(
    new Map<string, ToastTemplate>()
  );
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timer>();
  const [newToastTimeoutPending, setNewToastTimeoutPending] = useState(false);
  const activeToastsRef = useRef<Map<string, ToastTemplate>>();
  activeToastsRef.current = activeToasts;

  // popup states
  const [popupId, setPopupId] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  //
  // initial connections
  //

  const attemptDiscordConnection = useCallback((retries = 0) => {
    setWebsocketStatus('attempting');
    fetch('http://localhost:11620/json')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        // check results
        const foundWebsocket = json.find((element: WebsocketResult) => {
          if (element.title !== '' && element.title !== 'Discord Updater') {
            return true;
          }
          return false;
        });
        if (foundWebsocket == null) {
          if (retries < 5) {
            setTimeout(() => attemptDiscordConnection(retries + 1), 2500);
            return null;
          }
          setWebsocketStatus('disconnected');
          return null;
        }
        window.electron.ipcRenderer.sendMessage('websocket-url-found', [
          foundWebsocket.webSocketDebuggerUrl,
        ]);
        return null;
      })
      .catch(() => {
        // console.error('Unable to grab Discord websocket: '.concat(error));
        setWebsocketStatus('disconnected');
      });
  }, []);

  const retryDiscordConnection = () => {
    window.electron.ipcRenderer.sendMessage('restart-retry-connection', []);
    setWebsocketStatus('attempting');
    setTimeout(() => {
      attemptDiscordConnection();
    }, 2500);
  };

  // initialize connection to Discord's remote debugger
  useEffect(() => {
    setWebsocketStatus('attempting');
    setTimeout(() => attemptDiscordConnection(), 2500);
  }, [attemptDiscordConnection]);

  //
  // popup management
  //

  const createPopup = (id: string) => {
    setPopupId(id);
    setShowPopup(true);
  };

  const closePopup = () => {
    setTimeout(() => setPopupId(''), 100);
    setShowPopup(false);
  };

  //
  // toast management
  //

  const clearToasts = useCallback(
    (toasts: Map<string, ToastTemplate> | undefined) => {
      if (toasts === undefined) return;
      const tempToasts = new Map<string, ToastTemplate>();
      toasts.forEach((v, k) => {
        tempToasts.set(k, { label: v.label, show: false });
      });
      setActiveToasts(tempToasts);
    },
    []
  );

  const removeFromToasts = useCallback(
    (id: string) => {
      const tempToasts = new Map<string, ToastTemplate>();
      activeToasts.forEach((v, k) => {
        if (k !== id && v.show) tempToasts.set(k, v);
      });
      setActiveToasts(tempToasts);
    },
    [activeToasts]
  );

  const setToast = useCallback(
    (label: string) => {
      // unshow all other toasts
      const toasts = new Map<string, ToastTemplate>();
      activeToasts.forEach((v, k) => {
        toasts.set(k, { label: v.label, show: false });
      });

      // add new toast
      toasts.set(crypto.randomUUID(), { label, show: true });

      // update to toast list
      setActiveToasts(toasts);
      setNewToastTimeoutPending(true);

      clearTimeout(toastTimeout);
      setToastTimeout(
        setTimeout(() => clearToasts(activeToastsRef.current), 2500)
      );
    },
    [activeToasts, clearToasts, toastTimeout]
  );

  //
  // ipc listeners
  //

  useEffect(() => {
    window.electron.ipcRenderer.on('init-first-time-setup', () => {
      createPopup('FirstTimeSetup');
    });

    window.electron.ipcRenderer.on('font-list-generated', (args) => {
      const fontList = args as string[];
      setFonts(fontList);
      // request last set font
      window.electron.ipcRenderer.sendMessage('get-last-font-set', []);
    });

    window.electron.ipcRenderer.on('retrieved-last-font-set', (args) => {
      const lastFontSet: string = (args as string[])[0];
      setSelectedFont(lastFontSet);
    });

    window.electron.ipcRenderer.on('websocket-opened', () => {
      setWebsocketStatus('connected');
      setWebsocketRetries(0);
    });

    window.electron.ipcRenderer.on('websocket-error', () => {
      if (websocketRetries < 5) {
        setWebsocketStatus('attempting');
        setWebsocketRetries(websocketRetries + 1);
        setTimeout(() => {
          attemptDiscordConnection();
        }, 1500);
        return;
      }
      setWebsocketStatus('disconnected');
    });

    window.electron.ipcRenderer.on('websocket-closed', () => {
      setWebsocketStatus('disconnected');
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('init-first-time-setup');
      window.electron.ipcRenderer.removeAllListeners('font-list-generated');
      window.electron.ipcRenderer.removeAllListeners('retrieved-last-font-set');
      window.electron.ipcRenderer.removeAllListeners('websocket-opened');
      window.electron.ipcRenderer.removeAllListeners('websocket-error');
      window.electron.ipcRenderer.removeAllListeners('websocket-closed');
    };
  });

  //
  // font fetcher
  //

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-all-fonts', []);
  }, []);

  //
  // content generators
  //

  const generatePopupComponent = () => {
    switch (popupId) {
      case 'FontSelector':
        return (
          <FontSelector
            fonts={fonts}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            closeSelf={closePopup}
          />
        );
        break;
      case 'Settings':
        return <Settings closeSelf={closePopup} />;
        break;
      case 'FirstTimeSetup':
        return <FirstTimeSetup closeSelf={closePopup} />;
        break;
      default:
        return [];
    }
  };

  const generateToasts = () => {
    const generatedToasts: React.ReactNode[] = [];
    activeToasts.forEach((val) => {
      generatedToasts.push(
        <Toast
          label={val.label}
          show={val.show}
          destroySelf={() => {
            removeFromToasts(val.label);
          }}
        />
      );
    });
    return generatedToasts;
  };

  //
  // button handlers
  //

  const changeFont = () => {
    window.electron.ipcRenderer.sendMessage('change-font', [selectedFont]);
    setToast('Font applied!');
  };

  return (
    <div className="MainContainer">
      <div className="TitleContainer">
        <AppTitleText>Refont</AppTitleText>
        <IconButton
          src={SettingsIcon}
          alt="Settings"
          handleClick={() => createPopup('Settings')}
        />
      </div>
      <div className="FontTool">
        <SelectionEdit
          label={selectedFont}
          handleClick={() => {
            createPopup('FontSelector');
          }}
        />
        <MainButton
          label="Apply Font"
          disabled={websocketStatus !== 'connected'}
          onClick={changeFont}
        />
        <IconButton
          src={ResetIcon}
          alt="Reset Font"
          handleClick={() => {
            window.electron.ipcRenderer.sendMessage('reset-font', []);
            setToast('Font has reset');
          }}
        />
      </div>
      <DiscordStatus
        websocketStatus={websocketStatus}
        retryConnection={retryDiscordConnection}
      />
      {generateToasts()}
      <PopupProvider show={showPopup}>{generatePopupComponent()}</PopupProvider>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
