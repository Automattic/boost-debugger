<script lang="ts">
	import { onMount } from "svelte";
	import browser from 'webextension-polyfill';
	import { modules } from "../modules/modules";
	import type { ModuleDataPayload, StatusObject } from "../types/module";
	import { getPageUrl } from "../util/page-url";

	export let moduleData: ModuleDataPayload;

	let disabledModules: Set<string> = new Set();
	let currentUrl: string = '';

	const getModuleStatusMessage = (statusObj: StatusObject) => {
		const contextualMessages = {
			'positive': 'Working',
			'negative': 'Not Working',
			'neutral': 'Ok',
			'warning': 'Undetermined',
		}
		return statusObj.message || contextualMessages[statusObj.type]
	}

	const parseDisabledModulesFromUrl = (url: string): Set<string> => {
		try {
			const urlObj = new URL(url);
			const disabledParam = urlObj.searchParams.get('jb-disable-modules');
			if (disabledParam) {
				return new Set(disabledParam.split(',').filter(Boolean));
			}
		} catch (error) {
			console.error('Error parsing URL:', error);
		}
		return new Set();
	}

	const updateUrlDisabledModules = async (disabled: Set<string>) => {
		const tabs = await browser.tabs.query({ active: true, currentWindow: true });
		const disabledArray = Array.from(disabled);
		const paramValue = disabledArray.length > 0 ? disabledArray.join(',') : '';
		
		await browser.tabs.sendMessage(tabs[0].id as number, {
			type: 'update-url-params',
			value: { 'jb-disable-modules': paramValue }
		});
	}

	const handleModuleToggle = async (moduleId: string, isChecked: boolean) => {
		if (isChecked) {
			disabledModules.add(moduleId);
		} else {
			disabledModules.delete(moduleId);
		}
		
		// Create a new Set to trigger reactivity
		disabledModules = new Set(disabledModules);
		
		await updateUrlDisabledModules(disabledModules);
	}

	onMount(async () => {
		currentUrl = await getPageUrl() || '';
		disabledModules = parseDisabledModulesFromUrl(currentUrl);
	});
</script>

<table class="module-status-table">
	<thead>
		<tr>
			<th>Module</th>
			<th>Force Disable</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries(moduleData) as [moduleId, moduleStatus]}
		<tr class="{moduleStatus.type}">
			<td class="module-name">{modules[moduleId].label}</td>
			<td class="module-disable">
				<input 
					type="checkbox" 
					checked={disabledModules.has(moduleId)}
					on:change={(e) => handleModuleToggle(moduleId, e.target.checked)}
				/>
			</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus)}</td>
		</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	.module-status-table {
		width: 100%;

		thead th {
				text-align: left;
		}
	}
	.module-status {
		border: 1px solid black;
		padding: 4px;

		.positive & {
			background-color: green;
			color: white;
		}

		.negative & {
			background-color: red;
			color: white;
		}

		.neutral & {
			background-color: transparent;
		}

		.warning & {
			background-color: yellow;
		}
	}
</style>