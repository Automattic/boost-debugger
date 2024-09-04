import type { StatusObject } from "../types/module";

export interface Module {
	readonly identifier: string;

	getStatus(): StatusObject | Promise<StatusObject>;
}