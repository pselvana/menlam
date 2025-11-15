<script>
	import { onMount } from 'svelte';
	import { loadCSV } from './csvLoader.js';

	let csv = [];
	let patients = [];
	let sections = [];
	let illnesses = [];
	let variants = [];
	let selectedPatient = null;
	let selectedSection = null;
	let selectedIllness = null;
	let selectedVariant = null;
	let finalRows = [];

	onMount(async () => {
		csv = await loadCSV();

		console.log(csv);

		patients = [...new Set(csv.map((r) => r.Patient))].sort();
	});

	function choosePatient(p) {
		selectedPatient = p;
		selectedSection = null;
		selectedIllness = null;
		selectedVariant = null;
		finalRows = [];

		sections = [...new Set(csv.filter((r) => r.Patient === p).map((r) => r.Section))].sort();
	}

	function chooseSection(s) {
		selectedSection = s;
		selectedIllness = null;
		selectedVariant = null;
		finalRows = [];

		illnesses = [
			...new Set(
				csv.filter((r) => r.Patient === selectedPatient && r.Section === s).map((r) => r.Illness)
			)
		].sort();
	}

	function chooseIllness(i) {
		selectedVariant = null;

		selectedIllness = i;
		finalRows = [];

		// illness variants + causative agents in combinations
		variants = csv
			.filter(
				(r) => r.Patient === selectedPatient && r.Section === selectedSection && r.Illness === i
			)
			.map((r) => ({
				variant: r['Illness Variant'],
				agent: r['Common Causative Agents']
			}));
	}

	function chooseVariant(v) {
		selectedVariant = v;

		finalRows = csv.filter(
			(r) =>
				r.Patient === selectedPatient &&
				r.Section === selectedSection &&
				r.Illness === selectedIllness &&
				r['Illness Variant'] === v.variant &&
				r['Common Causative Agents'] === v.agent
		);
	}
</script>

<div class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Treatments</h1>

	<!-- PATIENT SELECTION -->
	<h2 class="mt-6 text-xl font-semibold">Choose Patient Type</h2>
	<div class="mt-2 flex flex-wrap gap-3">
		{#each patients as p}
			<button
				class="btn {selectedPatient === p ? 'btn-primary' : ''}"
				on:click={() => choosePatient(p)}
			>
				{p}
			</button>
		{/each}
	</div>

	{#if selectedPatient}
		<!-- SECTION -->
		<h2 class="mt-6 text-xl font-semibold">Choose Section</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each sections as s}
				<button
					class="btn {selectedSection === s ? 'btn-primary' : ''}"
					on:click={() => chooseSection(s)}
				>
					{s}
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedSection}
		<!-- ILLNESS -->
		<h2 class="mt-6 text-xl font-semibold">Choose Illness</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each illnesses as ill}
				<button
					class="btn {selectedIllness === ill ? 'btn-primary' : ''}"
					on:click={() => chooseIllness(ill)}
				>
					{ill}
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedIllness}
		<!-- VARIANTS -->
		<h2 class="mt-6 text-xl font-semibold">Choose Illness Variant & Agent</h2>
		<div class="mt-2 flex flex-col gap-3">
			{#each variants as v}
				<button
					class="btn btn-outline {selectedVariant === v ? 'btn-primary' : ''}"
					on:click={() => chooseVariant(v)}
				>
                    <b>{v.variant || "No Variant"}</b>{v.agent ? `[Agent: ${v.agent}]` : ""}
				</button>
			{/each}
		</div>
	{/if}

	{#if finalRows.length > 0}
		<h2 class="mt-6 text-xl font-semibold">Treatment Details</h2>

		<div class="overflow-x-auto">
			<table class="table mt-4 w-full table-zebra">
				<thead>
					<tr>
						{#each Object.keys(finalRows[0]) as header}
							<th>{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each finalRows as row}
						<tr>
							{#each Object.values(row) as cell}
								<td class="max-w-xs whitespace-pre-line">
									{cell}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
