import browser from 'webextension-polyfill';
import { type MessageTypes } from './types/app';

let hasBoostCacheHeader: string | false = false;

browser.runtime.onMessage.addListener((message) => {
  console.log('got message on bg script', message);
  switch (message.type as MessageTypes) {
    case 'get-boost-cache-header':
      return Promise.resolve(hasBoostCacheHeader);
  }
});

let activeTabId: number | undefined;

// Keep track of the active tab
browser.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});

browser.webRequest.onHeadersReceived.addListener(
  function(details) {
    // Only process if it's the main frame and matches the active tab
    if (details.type === 'main_frame' && details.tabId === activeTabId) {
      const header = details.responseHeaders?.find(h => h.name.toLowerCase() === 'x-jetpack-boost-cache');
      if (header && header.value) {
        hasBoostCacheHeader = header.value;
      }
    }
  },
  {urls: ["<all_urls>"]},
  ["responseHeaders"]
);

