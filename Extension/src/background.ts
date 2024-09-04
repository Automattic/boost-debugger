import browser from 'webextension-polyfill';
import { type MessageTypes } from './types/app';

let hasBoostCacheHeader: Record<number, string | false> = {};
let activeTabId: number = -1;

browser.runtime.onMessage.addListener((message) => {
	switch (message.type as MessageTypes) {
		case 'get-boost-cache-header':
			return Promise.resolve(hasBoostCacheHeader[activeTabId]);
	}
});

// Keep track of the active tab
browser.tabs.onActivated.addListener((activeInfo) => {
	activeTabId = activeInfo.tabId;
});

browser.webRequest.onHeadersReceived.addListener(
	function(details) {
		// Only process if it's the main frame and matches the active tab
		if (details.type === 'main_frame') {
			const header = details.responseHeaders?.find(h => h.name.toLowerCase() === 'x-jetpack-boost-cache');
			hasBoostCacheHeader[details.tabId] = header?.value || false;
		}
	},
	{urls: ["<all_urls>"]},
	["responseHeaders"]
);

