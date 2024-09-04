import type { StatusObject } from "../types/module";
import { hasComment } from "../util/has-comment";
import type { Module } from "./interface-module";

export class ConcatenateJs implements Module {
	public readonly identifier = 'concatenate-js';
	public readonly label = 'Concatenate JS';

	public getStatus(): StatusObject {
		if( this.hasConcatenatedJs() ) {
			return { type: 'positive' };
		}

		if( hasComment( document.head, 'No Concat JS' ) ) {
			return {
				type: 'warning',
				message: "Feature is enabled but all files are skipped"
			}
		}

		return { type: 'negative' };
	}
	
	private hasConcatenatedJs() {
		const script = document.querySelector('script[src*="_jb_static"]');
	
		// If there is a script which has `_jb_static` in the URL, Concatenate JS is at play.
		return script !== null;
	}
}