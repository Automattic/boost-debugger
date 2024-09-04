import type { Module } from "../modules/interface-module";

type Status = 'positive'|'negative'|'warning'|'neutral';

export type StatusObject= {
	type: Status,
	message?: string
};

export type ModuleData = {
	label: string,
	status: StatusObject,
}

export type ModuleDataPayload = Record< Module['identifier'], ModuleData >;