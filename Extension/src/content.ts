import browser from 'webextension-polyfill';
import { type MessageTypes } from './types/app';
import type { ModuleDataPayload } from './types/module';
import { modules } from './modules/modules';

browser.runtime.onMessage.addListener(message => {
	switch (message.type as MessageTypes) {
		case 'get-module-status': {
			return getModuleStatus();
		}
		case 'update-url-params': {
			return updateUrlParams(message.value);
		}
	}
});

async function getModuleStatus() {
	const statuses: ModuleDataPayload = {}
	for (const module of Object.values(modules)) {
		const status = await module.getStatus();
		statuses[module.identifier] = status;
	}

	return statuses;
}

async function updateUrlParams(params: Record<string, string>) {
	const url = new URL(window.location.href);
	
	// Update or remove parameters
	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			url.searchParams.set(key, value);
		} else {
			url.searchParams.delete(key);
		}
	});
	
	// Reload the page with the new URL so modules can be re-evaluated
	window.location.href = url.toString();
}
