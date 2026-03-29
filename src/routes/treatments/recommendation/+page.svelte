<script>
	import { onMount } from 'svelte';
	import { loadCSV } from '../csvLoader.js';
	import DosageCalculator from '$lib/DosageCalculator.svelte';
	import { getSections, getInfections, getSectionRemarks, getInfectionRemarks, getFinalRows } from '$lib/treatmentUtils.js';

	let csv = [];
	let patients = [];
	let sections = [];
	let infections = [];
    let sectionRemarks = null;
	let infectionRemarks = null;
	let selectedPatient = null;
	let selectedSection = null;
	let selectedInfection = null;
	let finalRows = [];
	let loading = true;

	function scrollToEl(el) {
		setTimeout(() => {
			el?.scrollIntoView({ behavior: "smooth" });
		}, 50);
	}

	let sectionView;
	let infectionView;
	let tableView;

	onMount(async () => {
		csv = await loadCSV();
		patients = [...new Set(csv.map((r) => r.Patient))].sort();
		loading = false;
	});

	function choosePatient(p) {
		selectedPatient = p;
		selectedSection = null;
		sectionRemarks = null;
		infectionRemarks = null;
		selectedInfection = null;
		finalRows = [];

		sections = getSections(csv, p);

		scrollToEl(sectionView);
	}

	function chooseSection(s) {
		selectedSection = s;
		selectedInfection = null;
		finalRows = [];

		infections = getInfections(csv, selectedPatient, s);
		sectionRemarks = getSectionRemarks(csv, selectedPatient, s);

		scrollToEl(infectionView);
	}

	function chooseInfection(i) {
		selectedInfection = i;
		finalRows = getFinalRows(csv, selectedPatient, selectedSection, i);
		infectionRemarks = getInfectionRemarks(csv, selectedPatient, selectedSection, i);

		scrollToEl(tableView);
	}
</script>

<div class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Treatments</h1>

	{#if loading}
		<div class="flex justify-center items-center py-8">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else}

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
			class="btn bg-gray-300 btn-disabled"
		>
			Paediatrics (coming soon)
		</button>
		<button
			class="btn bg-green-300 btn-disabled"
		>
			Neonates (coming soon)
		</button>
	</div>

	<section bind:this={sectionView}></section>
	{#if selectedPatient}
		<!-- SECTION -->
		<h2 class="mt-6 text-xl font-semibold">Choose Site of Infection</h2>
		<div class="mt-2 flex flex-wrap gap-3">
			{#each sections as s}
				<button
					class="btn {selectedSection === s ? 'btn-secondary' : 'btn-outline bg-blue-100'}"
					on:click={() => chooseSection(s)}
				>
					{s}
				</button>
			{/each}
		</div>
	{/if}

	<section bind:this={infectionView}></section>
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
					class="btn {selectedInfection === inf ? 'btn-secondary' : 'btn-outline  bg-blue-200'}"
					on:click={() => chooseInfection(inf)}
				>
					{inf}
				</button>
			{/each}
		</div>
	{/if}

	<section bind:this={tableView}></section>
	{#if finalRows.length > 0}
		{#if infectionRemarks}
			<div class="mt-4 rounded border border-base-300 bg-base-200 p-4">
				<h3 class="mb-2 text-lg font-semibold">Infection Remarks:</h3>
				<p>{infectionRemarks}</p>
			</div>
		{/if}
		<h2 class="mt-6 text-xl font-semibold">Treatment Details</h2>

		<DosageCalculator />

		<div class="overflow-x-auto">
			<table class="table mt-4 w-full table-zebra table-pin-rows border border-base-content/5 bg-base-100 rounded-box">
				<thead>
					<tr>
						{#each Object.keys(finalRows[0]) as header}
							<th>{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each finalRows as row}
						<tr class="hover:bg-base-300">
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

	{/if}
</div>
