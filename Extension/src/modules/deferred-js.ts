import type { StatusObject } from "../types/module";
import type { Module } from "./interface-module";

export class DeferredJs implements Module {
	public readonly identifier = 'deferred-js';

	public getStatus(): StatusObject {
		const nonDeferredFiles = this.getNonDeferredJs();

		return {
			type: nonDeferredFiles.length === 0 ? "positive" : "negative",
			message: nonDeferredFiles.length === 0 ? undefined : `${nonDeferredFiles.length} files weren't deferred`
		}
	}

	private getNonDeferredJs() {
		return document.querySelectorAll( 'head script:not([data-jetpack-boost="ignore"])');
	}
}