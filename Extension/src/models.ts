export type BrowserMessageType = 'getModuleStatus';

export type BrowserMessage = {
  type: BrowserMessageType;
  value?: any;
};

export type AppSettings = {
  displayHelpMessage: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  displayHelpMessage: true
};

export type ColorScheme = 'light' | 'dark';
