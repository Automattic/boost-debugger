<script lang=ts>
	import ModuleStatusTable from "../components/module-status-table.svelte";
</script>
<div class="jetpack-boost-debugger">
	<h1>Jetpack Boost Debugger</h1>
	<ModuleStatusTable moduleStatus={{
		criticalCss: { status: 'positive' },
		lazyLoading: { status: 'negative' },
		deferredJs: { status: 'positive' },
		concatenateJs: { status: 'warning' },
		concatenateCss: { status: 'neutral' },
		imageCdn: { status: 'warning', message: "I'm sorry, I have no idea :'("}
	}} />
</div>

<style>
	.jetpack-boost-debugger {
		width: 600px;
		max-width: 100%;
	}
</style>