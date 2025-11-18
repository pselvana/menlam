<script>
	import { onMount } from 'svelte';
	import { loadCSV } from '../csvLoader.js';
	import DosageCalculator from '$lib/DosageCalculator.svelte';

	let csv = [];
	let patients = [];
	let sections = [];
	let illnesses = [];
    let sectionRemarks = null;
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
        sectionRemarks = null;
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

        // Store section remarks
        const remarkRow = csv.find(r => r.Patient === selectedPatient && r.Section === s && r['Section Remarks']);
        sectionRemarks = remarkRow ? remarkRow['Section Remarks'] : "";
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

        // Remove Patient, Section, Section Remarks, Illness, Illness Variant, Common Causative Agents columns from finalRows
        finalRows = finalRows.map(({ Patient, Section, 'Section Remarks': _, Illness, 'Illness Variant': __, 'Common Causative Agents': ___, ...rest }) => rest);
	}
</script>

<div class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Treatments</h1>

	<!-- PATIENT SELECTION -->
	<h2 class="mt-6 text-xl font-semibold">Choose Patient Type</h2>
	<div class="mt-2 flex flex-wrap gap-3">
		{#each patients as p}
			<button
				class="btn {selectedPatient === p ? 'btn-secondary' : 'btn-outline'}"
				on:click={() => choosePatient(p)}
			>
				{p}
			</button>
		{/each}
	</div>

	{#if selectedPatient}
		<!-- SECTION -->
		<h2 class="mt-6 text-xl font-semibold">Choose Clinical Category of Infection</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each sections as s}
				<button
					class="btn {selectedSection === s ? 'btn-secondary' : 'btn-outline'}"
					on:click={() => chooseSection(s)}
				>
					{s}
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedSection}
        {#if sectionRemarks}
            <div class="mt-4 rounded border border-base-300 bg-base-200 p-4">
                <h3 class="mb-2 text-lg font-semibold">Category Remarks:</h3>
                <p>{sectionRemarks}</p>
            </div>
        {/if}
		<!-- ILLNESS -->
		<h2 class="mt-6 text-xl font-semibold">Choose Infectious disease conditions</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each illnesses as ill}
				<button
					class="btn {selectedIllness === ill ? 'btn-secondary' : 'btn-outline'}"
					on:click={() => chooseIllness(ill)}
				>
					{ill}
				</button>
			{/each}
		</div>
	{/if}

	{#if selectedIllness}
		<!-- VARIANTS -->
		<h2 class="mt-6 text-xl font-semibold">Choose Illness Variant [Common Causative Agents]</h2>
		<div class="mt-2 flex flex-col gap-3">
			{#each variants as v}
				<button
					class="btn {selectedVariant === v? 'btn-secondary' : 'btn-outline'}"
					on:click={() => chooseVariant(v)}
				>
                    <b>{v.variant || "No Variant"}</b>{v.agent ? `[Agent: ${v.agent}]` : ""}
				</button>
			{/each}
		</div>
	{/if}

	{#if finalRows.length > 0}
		<h2 class="mt-6 text-xl font-semibold">Treatment Details</h2>

		<DosageCalculator />

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
