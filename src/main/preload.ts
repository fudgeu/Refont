import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'init-first-time-setup'
  | 'websocket-url-found'
  | 'websocket-opened'
  | 'websocket-closed'
  | 'websocket-error'
  | 'change-font'
  | 'get-all-fonts'
  | 'font-list-generated'
  | 'restart-retry-connection'
  | 'get-last-font-set'
  | 'retrieved-last-font-set'
  | 'set-start-on-boot'
  | 'get-start-on-boot'
  | 'retrieved-start-on-boot'
  | 'updated-start-on-boot'
  | 'set-start-minimized'
  | 'get-start-minimized'
  | 'retrieved-start-minimized'
  | 'reset-font';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeListener(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.removeListener(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
