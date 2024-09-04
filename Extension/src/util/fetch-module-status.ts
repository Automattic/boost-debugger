import browser from 'webextension-polyfill';

export async function fetchModuleStatus() {
	// Query the active tab
	const tabs = await browser.tabs.query({ active: true, currentWindow: true });

	// Send a message to the content script
	const response = await browser.tabs.sendMessage(tabs[0].id as number, { type: "get-module-status" });

	return response;
}