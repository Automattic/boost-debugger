import type { StatusObject } from "../types/module";
import type { Module } from "./interface-module";

export class CriticalCss implements Module {
	public readonly identifier = 'critical-css';

	public getStatus(): StatusObject {
		const hasCriticalCss = document.getElementById( 'jetpack-boost-critical-css' );
		
		return{
			type: hasCriticalCss ? "positive" : "negative"
		}
	}
}