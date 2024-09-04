import Browser from "webextension-polyfill";
import type { Module } from "./interface-module";
import type { StatusObject } from "../types/module";

export class PageCache implements Module {
	public readonly identifier = 'page-cache';
	public readonly label = 'Page Cache';

	public async getStatus(): Promise<StatusObject> {
		const header = await this.getCacheHeader();
		const status: StatusObject = {
			type: header ? "positive" : "negative",
		}

		if( header ) {
			status.message = `Cache enabled (${header})`;
		}

		return status;
	}

	private async getCacheHeader() {
		const header = await Browser.runtime.sendMessage({ type: 'get-boost-cache-header' });
		return header;
	}
}