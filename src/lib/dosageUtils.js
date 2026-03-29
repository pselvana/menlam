/**
 * Calculate total drug dose from weight and dosage per kg.
 * @param {string|number} weight
 * @param {string|number} dosage - mg per kg
 * @param {'kg'|'lb'} unit
 * @returns {{ weight: number, unit: string, dosagePerKg: number, totalMg: string } | null}
 *   Returns null when inputs are invalid.
 */
export function calculateDosage(weight, dosage, unit) {
	const w = parseFloat(weight);
	const d = parseFloat(dosage);

	if (isNaN(w) || isNaN(d) || w <= 0 || d <= 0 || w > 500 || d > 10000) {
		return null;
	}

	const weightKg = unit === 'lb' ? w * 0.453592 : w;
	const mg = d * weightKg;

	return {
		weight: w,
		unit,
		dosagePerKg: d,
		totalMg: mg.toFixed(2)
	};
}
