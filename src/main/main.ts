/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { exec } from 'child_process';
import Store, { Schema } from 'electron-store';
import WebSocket from 'ws';
import fs from 'fs';
import find from 'find-process';
import { getFonts } from 'font-list';
import Registry from 'winreg';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const appdataPath =
  process.env.APPDATA ||
  (process.platform === 'darwin'
    ? `${process.env.HOME}/Library/Preferences`
    : `${process.env.HOME}/.local/share`);

const basePath = app.getAppPath();

let mainWindow: BrowserWindow | null = null;

// load config
type Config = {
  startOnBoot: boolean;
  startMinimized: boolean;
  lastFontSet: string;
  firstLaunch: boolean;
  didDiscordAutostart: boolean;
};

const schema: Schema<Config> = {
  startOnBoot: {
    type: 'boolean',
    default: true,
  },
  startMinimized: {
    type: 'boolean',
    default: true,
  },
  lastFontSet: {
    type: 'string',
    default: 'Comic Sans MS',
  },
  firstLaunch: {
    type: 'boolean',
    default: true,
  },
  didDiscordAutostart: {
    type: 'boolean',
    default: false,
  },
};

const store = new Store<Config>({ schema });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    title: 'Refont',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED || store.get('startMinimized')) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('minimize', (event: Event) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      callback({
        responseHeaders: {
          'Access-Control-Allow-Origin': ['*'],
          ...details.responseHeaders,
        },
      });
    }
  );

  mainWindow.setMenu(null);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
//
// startup logic
//

// setup regedit
const regKey = new Registry({
  hive: Registry.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
});

// start discord
// find full path
const findFullDiscordPath = async () => {
  const partialPath = `${appdataPath}/../Local/Discord/`;
  let foundPath = '';
  try {
    const files = await fs.promises.readdir(partialPath);
    await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(partialPath, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory() && file.startsWith('app-')) {
          foundPath = path.join(fullPath, 'Discord.exe');
        }
      })
    );
  } catch {
    console.error('Unable to find Discord!');
  }
  return foundPath;
};

const startDiscord = (discordPath: string) => {
  exec(
    `${discordPath} --remote-debugging-port=11620`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting Discord: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error starting Discord: ${stderr}`);
      }
    }
  );
};

const initDiscord = async () => {
  const discordPath = await findFullDiscordPath();
  find('name', 'Discord', true)
    .then((list) => {
      process.kill(list[0].pid);
      // console.log(list);
      startDiscord(discordPath);
    })
    .catch((error) => {
      console.warn(
        `Error in restarting Discord, most likely Discord wasn't already open (can be ignored): ${error}`
      );
      startDiscord(discordPath);
    });
};

initDiscord();

//
// post-startup logic
//

let socket: WebSocket;

const setAutolaunch = (value: boolean) => {
  store.set('startOnBoot', value);
  app.setLoginItemSettings({
    openAtLogin: value,
    path: app.getPath('exe'),
  });
  mainWindow?.webContents.send('updated-start-on-boot', [value]);
};

const updateAutolaunchSettings = async (autolaunch: boolean) => {
  regKey.valueExists('Discord', async (error, exists) => {
    // do autolaunch
    if (autolaunch) {
      if (exists) {
        regKey.remove('Discord', () => {});
      }
      setAutolaunch(true);
      return;
    }

    // do not autolaunch
    if (!exists && store.get('didDiscordAutostart')) {
      // add discord to registry
      const discordPath = path
        .join(await findFullDiscordPath(), './../../Update.exe')
        .concat(' --processStart Discord.exe');
      regKey.set('Discord', Registry.REG_SZ, discordPath, () => {});
    }
    setAutolaunch(false);
  });
};

const firstTimeSetup = async () => {
  regKey.valueExists('Discord', (error, exists) => {
    store.set('didDiscordAutostart', exists);
    setTimeout(
      () => mainWindow?.webContents.send('init-first-time-setup', []),
      2500
    );
  });
};

if (store.get('firstLaunch')) {
  store.set('firstLaunch', false);
  firstTimeSetup();
}

// send font change
const sendFontChange = (newFont: string) => {
  if (socket == null) {
    return false;
  }

  const payload = {
    id: 11620,
    method: 'Runtime.evaluate',
    params: {
      expression: `document.querySelector("body").style.setProperty("--font-primary", "${newFont}"); document.querySelector("body").style.setProperty("--font-display", "${newFont}")`,
    },
  };

  // document.querySelector('body')?.style.removeProperty('--font-primary');
  // document.querySelector('body')?.style.removeProperty('--font-display');

  socket.send(JSON.stringify(payload));
  return true;
};

const resetFont = () => {
  if (socket == null) return false;

  const payload = {
    id: 11620,
    method: 'Runtime.evaluate',
    params: {
      expression: `document.querySelector('body')?.style.removeProperty('--font-primary'); document.querySelector('body')?.style.removeProperty('--font-display');`,
    },
  };

  socket.send(JSON.stringify(payload));
  return true;
};

// websocket
const createWebSocket = (url: string) => {
  // console.log('Connecting to URL '.concat(url));
  socket = new WebSocket(url);

  // detect websocket opened
  socket.on('open', () => {
    mainWindow?.webContents.send('websocket-opened', []);
    sendFontChange(store.get('lastFontSet'));
  });

  // detect error or closure
  socket.on('close', (err) => {
    console.warn(`Discord websocket closed: ${err}`);
    mainWindow?.webContents.send('websocket-closed', []);
  });

  socket.on('error', (err) => {
    console.error(`Discord websocket error: ${err}`);
    mainWindow?.webContents.send('websocket-error', []);
  });
};

// ipc calls
ipcMain.on('restart-retry-connection', async () => {
  initDiscord();
});

ipcMain.on('websocket-url-found', async (event, arg) => {
  setTimeout(() => {
    createWebSocket(arg[0]);
  }, 1500);
});

ipcMain.on('change-font', async (event, arg) => {
  store.set('lastFontSet', arg[0]);
  sendFontChange(arg[0]);
});

ipcMain.on('reset-font', async (event, arg) => {
  resetFont();
});

ipcMain.on('get-all-fonts', async (event) => {
  getFonts()
    .then((fonts) => {
      // remove quotes from fonts
      const fixedFonts = fonts.map((font) => {
        return font.replaceAll('"', '');
      });
      event.reply('font-list-generated', fixedFonts);
    })
    .catch((error) => {
      console.error(`Failed getting fonts: ${error}`);
    });
});

// ipc config interfaces
/*
ipcMain.on('get-store', async (event, arg) => {
  if (store.has(arg[0])) {
    event.reply('store-value-retrieved', [arg[0], store.get(arg[0])]);
  }
});

ipcMain.on('set-store', async (event, arg) => {
  try {
    store.set(arg[0], arg[1]);
  } catch (err) {
    console.error(
      `Failed to store ${arg[1]} into ${arg[0]}! This should not happen, if you see this, please report this bug. Error follows:`
    );
    console.error(err);
  }
});
*/

//
// IPC Store management
//

// last-font-set
ipcMain.on('get-last-font-set', async (event, arg) => {
  event.reply('retrieved-last-font-set', [store.get('lastFontSet')]);
});

// start-on-boot
ipcMain.on('set-start-on-boot', async (event, arg) => {
  updateAutolaunchSettings(arg[0]);
});

ipcMain.on('get-start-on-boot', async (event) => {
  event.reply('retrieved-start-on-boot', [store.get('startOnBoot')]);
});

// start-minimized
ipcMain.on('set-start-minimized', async (event, arg) => {
  store.set('startMinimized', arg[0]);
});

ipcMain.on('get-start-minimized', async (event) => {
  event.reply('retrieved-start-minimized', [store.get('startMinimized')]);
});

// setup tray
let tray = null;
app.on('ready', () => {
  tray = new Tray(nativeImage.createFromPath('assets/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Reset Font',
      click: () => {
        resetFont();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.on('click', () => {
    mainWindow?.show();
  });
  tray.setToolTip('Refont');
  tray.setContextMenu(contextMenu);
});
