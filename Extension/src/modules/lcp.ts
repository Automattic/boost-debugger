import type { StatusObject } from "../types/module";
import type { Module } from "./interface-module";

export class Lcp implements Module {
	public readonly identifier = 'lcp';
	public readonly label = 'Optimize LCP Images';

	public getStatus(): StatusObject {
		const lcpAttr = document.querySelector('[data-jp-lcp-optimized]');
		const hasLcpOptimized = lcpAttr !== null && lcpAttr.getAttribute('data-jp-lcp-optimized') === 'true';
		
		return{
			type: hasLcpOptimized ? "positive" : "negative"
		}
	}
}
