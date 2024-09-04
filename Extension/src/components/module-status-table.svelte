<script lang="ts">
  import type { ModuleDataPayload, StatusObject } from "../types/module";


	export let moduleStatus: ModuleDataPayload;

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
		{#each Object.values(moduleStatus) as module}
		<tr class="{module.status.type}">
			<td class="module-name">{module.label}</td>
			<td class="module-status">{getModuleStatusMessage(module.status)}</td>
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