<script lang="ts">
	import type { ModuleStatusType, StatusObject } from "../util/page-checker";

	export let moduleStatus: ModuleStatusType;

	const getModuleStatusMessage = (statusObj: StatusObject) => {
		const contextualMessages = {
			'positive': 'Working',
			'negative': 'Not Working',
			'neutral': 'Ok',
			'warning': 'Undetermined',
		}
		return statusObj.message || contextualMessages[statusObj.status]
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
		<tr class={moduleStatus.criticalCss.status}>
			<td class="module-name">Critical CSS</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.criticalCss)}</td>
		</tr>
		<tr class={moduleStatus.deferredJs.status}>
			<td class="module-name">Deferred JS</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.deferredJs)}</td>
		</tr>
		<tr class={moduleStatus.lazyLoading.status}>
			<td class="module-name">Lazy Loading</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.lazyLoading)}</td>
		</tr>
		<tr class={moduleStatus.concatenateCss.status}>
			<td class="module-name">Concatenate CSS</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.concatenateCss)}</td>
		</tr>
		<tr class={moduleStatus.concatenateJs.status}>
			<td class="module-name">Concatenate JS</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.concatenateJs)}</td>
		</tr>
		<tr class={moduleStatus.imageCdn.status}>
			<td class="module-name">Image CDN</td>
			<td class="module-status">{getModuleStatusMessage(moduleStatus.imageCdn)}</td>
		</tr>
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