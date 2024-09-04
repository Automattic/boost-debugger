import { ConcatenateCss } from "./concatenate-css";
import { ConcatenateJs } from "./concatenate-js";
import { CriticalCss } from "./critical-css";
import { DeferredJs } from "./deferred-js";
import { ImageCdn } from "./image-cdn";
import type { Module } from "./interface-module";
import { PageCache } from "./page-cache";

export const modules: Record<Module['identifier'], Module> = {};

const list = [
	new CriticalCss(),
	new PageCache(),
	new DeferredJs(),
	new ImageCdn(),
	new ConcatenateCss(),
	new ConcatenateJs(),
];

for (const module of list) {
	modules[module.identifier] = module;
}
