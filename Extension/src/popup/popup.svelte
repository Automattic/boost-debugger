<script lang=ts>
  import { onMount } from "svelte";
	import ModuleStatusTable from "../components/module-status-table.svelte";
	import PageChecker, { type ModuleStatusType } from "../util/page-checker";
	import { fetchModuleStatus } from "../util/fetch-module-status";

	let moduleStatus : ModuleStatusType | null = null;
	onMount( async function() {
		moduleStatus = await fetchModuleStatus();
		console.log( { moduleStatus } );
	} );
</script>
<div class="jetpack-boost-debugger">
	<h1>Jetpack Boost Debugger</h1>
	{#if moduleStatus}
		<ModuleStatusTable moduleStatus={ moduleStatus } />
	{:else}
		Inspecting...
	{/if}
</div>

<style>
	.jetpack-boost-debugger {
		width: 600px;
		max-width: 100%;
	}
</style>