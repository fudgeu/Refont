declare global {
  // discord websocket result
  type WebsocketResult = {
    type: string;
    title: string;
    webSocketDebuggerUrl: string;
  };

  // dropdown
  type DropdownItem = {
    id: string;
    label: string;
  };

  // list selector
  type ListItemTemplate = {
    id: string;
    label: string;
  };
}

export {};
