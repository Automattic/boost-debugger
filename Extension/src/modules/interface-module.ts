import type { StatusObject } from "../types/module";

export interface Module {
	readonly identifier: string;
	readonly label: string;

	getStatus(): StatusObject | Promise<StatusObject>;
}