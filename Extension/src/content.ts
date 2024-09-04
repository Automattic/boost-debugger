import browser from 'webextension-polyfill';
import { type MessageTypes } from './types/app';
import type { ModuleDataPayload } from './types/module';
import { modules } from './modules/modules';

browser.runtime.onMessage.addListener(message => {
	switch (message.type as MessageTypes) {
		case 'get-module-status': {
			return getModuleStatus();
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
