import type { StatusObject } from "../types/module";
import { hasComment } from "../util/has-comment";
import type { Module } from "./interface-module";

export class ConcatenateCss implements Module {
	public readonly identifier = 'concatenate-css';

	public getStatus(): StatusObject {
		if( this.hasConcatenatedCss() ) {
			return { type: 'positive' };
		}

		if( hasComment( document.head, 'No Concat CSS' ) ) {
			return {
				type: 'warning',
				message: "Feature is enabled but all files are skipped"
			}
		}

		return { type: 'negative' };
	}
	
	private hasConcatenatedCss() {
		const stylesheet = document.querySelector('link[rel="stylesheet"][href*="_jb_static"]');
	
		// If there is a stylesheet which has `_jb_static` in the URL, Concatenate CSS is at play.
		return stylesheet !== null;
	}
}