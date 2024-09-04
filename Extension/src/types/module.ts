import type { Module } from "../modules/interface-module";

type Status = 'positive'|'negative'|'warning'|'neutral';

export type StatusObject= {
	type: Status,
	message?: string
};

export type ModuleDataPayload = Record< Module['identifier'], StatusObject >;