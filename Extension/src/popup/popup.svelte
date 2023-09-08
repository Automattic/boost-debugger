<script lang=ts>
  import { onMount } from "svelte";
	import ModuleStatusTable from "../components/module-status-table.svelte";
	import { type ModuleStatusType } from "../util/page-checker";
	import { fetchModuleStatus } from "../util/fetch-module-status";
	import { getPageUrl } from "../util/page-url";

	let moduleStatus : ModuleStatusType | null = null;
	let pageUrl : string | undefined = '';

	onMount( async function() {
		moduleStatus = await fetchModuleStatus();
		pageUrl = await getPageUrl();
	} );

	$: jetpackDebuggerUrl = pageUrl ? 'https://jptools.wordpress.com/debug/?url=' + encodeURIComponent( pageUrl ) : null;
</script>
<div class="jetpack-boost-debugger">
	<h1>Jetpack Boost Debugger</h1>
	{#if moduleStatus}
		<ModuleStatusTable moduleStatus={ moduleStatus } />
	{:else}
		Inspecting...
	{/if}

	{#if jetpackDebuggerUrl }
		<a href={jetpackDebuggerUrl} target="_blank">Jetpack Debugger</a>
	{/if}
</div>

<style>
	.jetpack-boost-debugger {
		width: 600px;
		max-width: 100%;
	}
</style>