export type MessageTypes = 'get-module-status' | 'get-boost-cache-header';

export type Message = {
	type: MessageTypes;
	value?: any;
};

export type AppSettings = {
	displayHelpMessage: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
	displayHelpMessage: true
};

export type ColorScheme = 'light' | 'dark';
