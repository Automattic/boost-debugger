import browser from 'webextension-polyfill';
import { type MessageTypes } from './models';
import { type Module } from './modules/interface-module';
import { CriticalCss } from './modules/critical-css';
import { PageCache } from './modules/page-cache';
import { DeferredJs } from './modules/deferred-js';
import { ImageCdn } from './modules/image-cdn';
import { ConcatenateCss } from './modules/concatenate-css';
import { ConcatenateJs } from './modules/concatenate-js';
import type { ModuleDataPayload } from './types/module';

browser.runtime.onMessage.addListener(message => {
	switch (message.type as MessageTypes) {
		case 'get-module-status': {
			return getModuleStatus();
		}
	}
});

async function getModuleStatus() {
	const modules: Module[] = [
		new CriticalCss(),
		new PageCache(),
		new DeferredJs(),
		new ImageCdn(),
		new ConcatenateCss(),
		new ConcatenateJs(),
	];

	const statuses: ModuleDataPayload = {}
	for (const module of modules) {
		const status = await module.getStatus();
		statuses[module.identifier] = {
			label: module.identifier,
			status
		};
	}

	return statuses;
}
