<script>
	import { onMount } from 'svelte';
	import { loadCSV } from '../csvLoader.js';
	import DosageCalculator from '$lib/DosageCalculator.svelte';

	let csv = [];
	let patients = [];
	let sections = [];
	let infections = [];
    let sectionRemarks = null;
	let selectedPatient = null;
	let selectedSection = null;
	let selectedInfection = null;
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
		selectedInfection = null;
		finalRows = [];

		sections = [...new Set(csv.filter((r) => r.Patient === p).map((r) => r.Section))].sort();
	}

	function chooseSection(s) {
		selectedSection = s;
		selectedInfection = null;
		finalRows = [];

		infections = [
			...new Set(
				csv.filter((r) => r.Patient === selectedPatient && r.Section === s).map((r) => r.Infection)
			)
		].sort();

        // Store section remarks
        const remarkRow = csv.find(r => r.Patient === selectedPatient && r.Section === s && r['Section Remarks']);
        sectionRemarks = remarkRow ? remarkRow['Section Remarks'] : "";
	}

	function chooseInfection(i) {

		selectedInfection = i;
		finalRows = [];

		finalRows = csv.filter(
			(r) =>
				r.Patient === selectedPatient &&
				r.Section === selectedSection &&
				r.Infection === selectedInfection
		);

		// Remove Patient, Section, Section Remarks, Infection columns from finalRows
        finalRows = finalRows.map(({ Patient, Section, 'Section Remarks': _, Infection, ...rest }) => rest);
	}
</script>

<div class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Treatments</h1>

	<!-- PATIENT SELECTION -->
	<h2 class="mt-6 text-xl font-semibold">Choose Patient Group</h2>
	<div class="mt-2 flex flex-wrap gap-3">
		<button
			class="btn bg-blue-300"
			on:click={() => choosePatient("Adult")}
		>
			Adult
		</button>
		<button
			class="btn bg-gray-300"
			on:click={() => choosePatient("Paediatrics")}
		>
			Paediatrics
		</button>
		<button
			class="btn bg-green-300"
			on:click={() => choosePatient("Neonates")}
		>
			Neonates
		</button>
	</div>

	{#if selectedPatient}
		<!-- SECTION -->
		<h2 class="mt-6 text-xl font-semibold">Choose Site of Infection</h2>
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
                <h3 class="mb-2 text-lg font-semibold">Section Remarks:</h3>
                <p>{sectionRemarks}</p>
            </div>
        {/if}
		<!-- Infection -->
		<h2 class="mt-6 text-xl font-semibold">Choose Type of Infection</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each infections as inf}
				<button
					class="btn {selectedInfection === inf ? 'btn-secondary' : 'btn-outline'}"
					on:click={() => chooseInfection(inf)}
				>
					{inf}
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
