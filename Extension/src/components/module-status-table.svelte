<script lang="ts">
	import { modules } from "../modules/modules";
	import type { ModuleDataPayload, StatusObject } from "../types/module";

	export let moduleData: ModuleDataPayload;

	const getModuleStatusMessage = (statusObj: StatusObject) => {
		const contextualMessages = {
			'positive': 'Working',
			'negative': 'Not Working',
			'neutral': 'Ok',
			'warning': 'Undetermined',
		}
		return statusObj.message || contextualMessages[statusObj.type]
	}
</script>

<table class="module-status-table">
	<thead>
		<tr>
			<th>Module</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.entries(moduleData) as [moduleId, moduleStatus]}
		<tr class="{moduleStatus.type}">
			<td class="module-name">{modules[moduleId].label}</td>
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