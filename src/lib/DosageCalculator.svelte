<script>
	import { calculateDosage as computeDosage } from './dosageUtils.js';

	let open = false;
	let weight = '';
	let unit = 'kg';
	let dosage = '';
	let result = null;
	let errorMsg = '';

	function calculateDosage() {
		const r = computeDosage(weight, dosage, unit);
		if (r === null) {
			errorMsg = 'Please enter valid numbers.';
			result = null;
		} else {
			errorMsg = '';
			result = r;
		}
	}

	function clear() {
		weight = '';
		dosage = '';
		result = null;
		errorMsg = '';
	}
</script>

<!-- Trigger button -->
<div class="flex justify-end">
	<button
		class="btn bg-green-600 p-6 text-white"
		on:click={() => (open = true)}
		aria-label="Open dosage calculator"
	>
		Dosage Calculator
		<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64">
			<rect x="8" y="4" width="48" height="56" rx="6" fill="#374151" />
			<rect x="16" y="10" width="32" height="12" rx="2" fill="white" />
			<rect x="16" y="28" width="12" height="12" rx="2" fill="white" />
			<rect x="36" y="28" width="12" height="12" rx="2" fill="white" />
			<rect x="16" y="44" width="12" height="12" rx="2" fill="white" />
			<rect x="36" y="44" width="12" height="12" rx="2" fill="white" />
			<text x="22" y="35" font-size="12" fill="#374151" text-anchor="middle" dominant-baseline="middle">+</text>
			<text x="42" y="35" font-size="12" fill="#374151" text-anchor="middle" dominant-baseline="middle">−</text>
			<text x="22" y="51" font-size="14" fill="#374151" text-anchor="middle" dominant-baseline="middle">×</text>
			<text x="42" y="51" font-size="14" fill="#374151" text-anchor="middle" dominant-baseline="middle">÷</text>
		</svg>
	</button>
</div>

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-40 bg-black/30"
		role="presentation"
		on:click={() => (open = false)}
	></div>

	<!-- Side panel -->
	<div
		class="fixed top-0 right-0 z-50 h-full w-80 bg-base-200 shadow-xl flex flex-col p-4"
		role="dialog"
		aria-label="Dosage calculator"
	>
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-bold">Dosage Calculator</h2>
			<button class="btn btn-sm btn-ghost" on:click={() => (open = false)} aria-label="Close">✕</button>
		</div>

		<div class="form-control mb-4">
			<label for="weightinput" class="label"><span class="label-text">Weight</span></label>
			<input id="weightinput" bind:value={weight} type="number" placeholder="Enter weight" class="input input-bordered" />
			<select bind:value={unit} class="select select-bordered mt-2">
				<option value="kg">Kilograms (kg)</option>
				<option value="lb">Pounds (lb)</option>
			</select>
		</div>

		<div class="form-control mb-4">
			<label class="label" for="dosage"><span class="label-text">Dosage (mg/kg)</span></label>
			<input id="dosage" bind:value={dosage} type="number" placeholder="Enter dosage in mg/kg" class="input input-bordered" />
		</div>

		<div class="flex gap-2">
			<button on:click={calculateDosage} class="btn flex-1 bg-green-600 text-white">Calculate</button>
			<button on:click={clear} class="btn btn-outline flex-1">Clear</button>
		</div>

		<div class="mt-4 p-3 bg-base-100 rounded border border-base-300 min-h-16" aria-live="polite">
			{#if errorMsg}
				<p class="text-error text-sm">{errorMsg}</p>
			{:else if result}
				<dl class="text-sm space-y-1">
					<div class="flex justify-between">
						<dt class="text-base-content/70">Weight</dt>
						<dd class="font-medium">{result.weight} {result.unit}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-base-content/70">Dosage per kg</dt>
						<dd class="font-medium">{result.dosagePerKg} mg</dd>
					</div>
					<div class="divider my-1"></div>
					<div class="flex justify-between">
						<dt class="font-semibold">Total dose</dt>
						<dd class="font-bold text-base">{result.totalMg} mg</dd>
					</div>
				</dl>
			{/if}
		</div>
	</div>
{/if}
