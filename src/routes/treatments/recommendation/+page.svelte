<script>
	import { onMount } from 'svelte';
	import { loadCSV } from '../csvLoader.js';

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

	let weight = '';
	let unit = 'kg';
	let dosage = '';
	let result = '';

	function calculateDosage() {
		const w = parseFloat(weight);
		const d = parseFloat(dosage);

		if (isNaN(w) || isNaN(d) || w <= 0 || d <= 0 || w > 500 || d > 10000) {
			result = "⚠️ Please enter valid numbers.";
			return;
		}

		// Convert pounds to kilograms if needed
		let weightKg = unit === "lb" ? w * 0.453592 : w;

		// Calculate mg per kg
		let mg = d * weightKg;

		result = `✅ Weight: ${w} ${unit}
	✅ Dosage per kg: ${d} mg
	📊 Dosage: ${mg.toFixed(2)} mg`;
	}
</script>

<div class="p-6">
	<h1 class="mb-4 text-3xl font-bold">Treatments</h1>

	<!-- PATIENT SELECTION -->
	<h2 class="mt-6 text-xl font-semibold">Choose Patient Type</h2>
	<div class="mt-2 flex flex-wrap gap-3">
		{#each patients as p}
			<button
				class="btn {selectedPatient === p ? 'btn-accent' : 'btn-secondary'}"
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
					class="btn {selectedSection === s ? 'btn-accent' : 'btn-secondary'}"
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
					class="btn {selectedIllness === ill ? 'btn-accent' : 'btn-secondary'}"
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
					class="btn {selectedVariant === v? 'btn-accent' : 'btn-secondary'}"
					on:click={() => chooseVariant(v)}
				>
                    <b>{v.variant || "No Variant"}</b>{v.agent ? `[Agent: ${v.agent}]` : ""}
				</button>
			{/each}
		</div>
	{/if}

	{#if finalRows.length > 0}
		<h2 class="mt-6 text-xl font-semibold">Treatment Details</h2>

		<div class="drawer drawer-end">
			<input id="my-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content">
				<!-- Page content here -->
				<label for="my-drawer" class="drawer-button btn btn-primary">Calculator</label>
			</div>
			<div class="drawer-side">
				<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
				<div class="menu w-80 bg-base-200 p-4">
				<h2 class="mb-4 text-lg font-bold">Dosage Calculator</h2>

				<!-- Weight input -->
				<div class="form-control mb-4">
				<label for="weightinput" class="label"><span class="label-text">Weight</span></label>
				<input id="weightinput" bind:value={weight} type="number" placeholder="Enter weight" class="input input-bordered" />
				<select bind:value={unit} class="select select-bordered mt-2">
					<option value="kg">Kilograms (kg)</option>
					<option value="lb">Pounds (lb)</option>
				</select>
				</div>

				<div class="form-control mb-4">
				<label class="label" for="dosage"><span class="label-text">Dosage (mg)</span></label>
				<input id="dosage" bind:value={dosage} type="number" placeholder="Enter dosage in mg/kg" class="input input-bordered" />
				</div>

				<button on:click={calculateDosage} class="btn btn-primary w-full">Calculate</button>

				<div class="mt-4 p-3 bg-base-100 rounded border border-base-300">
				{#if result}
					<pre>{result}</pre>
				{/if}
				</div>
				</div>
			</div>
		</div>

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
