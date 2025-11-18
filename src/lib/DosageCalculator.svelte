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
    <div class="drawer-content">
        <!-- Page content here -->
        <label for="my-drawer" class="drawer-button btn btn-accent">Dosage Calculator</label>
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

        <button on:click={calculateDosage} class="btn btn-accent w-full">Calculate</button>

        <div class="mt-4 p-3 bg-base-100 rounded border border-base-300">
        {#if result}
            <pre>{result}</pre>
        {/if}
        </div>
        </div>
    </div>
</div>