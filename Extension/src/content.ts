import browser from 'webextension-polyfill';
import { type BrowserMessageType } from './models';
import PageChecker from './util/page-checker';

browser.runtime.onMessage.addListener(message => {
  switch (message.type as BrowserMessageType) {
    case 'getModuleStatus': {
      return Promise.resolve( getModuleStatus() );
    }
  }
});

function getModuleStatus() {
  const pageChecker = new PageChecker();
  return pageChecker.getPageStatus();
}
