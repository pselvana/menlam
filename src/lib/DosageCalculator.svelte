<script>
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

<div class="drawer drawer-end z-1000">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex justify-end">
        <!-- Page content here -->
        <label for="my-drawer" class="drawer-button btn bg-green-600 p-6 text-white">Dosage Calculator
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64">
            <rect x="8" y="4" width="48" height="56" rx="6" fill="#374151"/>
            <rect x="16" y="10" width="32" height="12" rx="2" fill="white"/>

            <!-- Buttons background -->
            <rect x="16" y="28" width="12" height="12" rx="2" fill="white"/>
            <rect x="36" y="28" width="12" height="12" rx="2" fill="white"/>
            <rect x="16" y="44" width="12" height="12" rx="2" fill="white"/>
            <rect x="36" y="44" width="12" height="12" rx="2" fill="white"/>

            <!-- Symbols -->
            <text x="22" y="35" font-size="12" fill="#374151" text-anchor="middle" dominant-baseline="middle">+</text>
            <text x="42" y="35" font-size="12" fill="#374151" text-anchor="middle" dominant-baseline="middle">−</text>
            <text x="22" y="51" font-size="14" fill="#374151" text-anchor="middle" dominant-baseline="middle">×</text>
            <text x="42" y="51" font-size="14" fill="#374151" text-anchor="middle" dominant-baseline="middle">÷</text>
            </svg>
        </label>

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

        <button on:click={calculateDosage} class="btn w-full bg-green-600 p-6 text-white">Calculate</button>

        <div class="mt-4 p-3 bg-base-100 rounded border border-base-300">
        {#if result}
            <pre>{result}</pre>
        {/if}
        </div>
        </div>
    </div>
</div>