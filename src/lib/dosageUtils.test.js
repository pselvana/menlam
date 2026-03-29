import { describe, it, expect } from 'vitest';
import { calculateDosage } from './dosageUtils.js';

describe('calculateDosage — validation', () => {
	it('returns null for non-numeric weight', () => {
		expect(calculateDosage('abc', '10', 'kg')).toBeNull();
	});

	it('returns null for non-numeric dosage', () => {
		expect(calculateDosage('70', 'abc', 'kg')).toBeNull();
	});

	it('returns null for zero weight', () => {
		expect(calculateDosage('0', '10', 'kg')).toBeNull();
	});

	it('returns null for negative weight', () => {
		expect(calculateDosage('-5', '10', 'kg')).toBeNull();
	});

	it('returns null for zero dosage', () => {
		expect(calculateDosage('70', '0', 'kg')).toBeNull();
	});

	it('returns null for negative dosage', () => {
		expect(calculateDosage('70', '-5', 'kg')).toBeNull();
	});

	it('returns null for weight above 500 kg', () => {
		expect(calculateDosage('501', '10', 'kg')).toBeNull();
	});

	it('returns null for dosage above 10000 mg/kg', () => {
		expect(calculateDosage('70', '10001', 'kg')).toBeNull();
	});

	it('returns null for empty strings', () => {
		expect(calculateDosage('', '', 'kg')).toBeNull();
	});
});

describe('calculateDosage — kg calculation', () => {
	it('calculates total dose correctly', () => {
		const result = calculateDosage('70', '10', 'kg');
		expect(result).not.toBeNull();
		expect(result.totalMg).toBe('700.00');
		expect(result.weight).toBe(70);
		expect(result.dosagePerKg).toBe(10);
		expect(result.unit).toBe('kg');
	});

	it('accepts boundary weight of exactly 500 kg', () => {
		const result = calculateDosage('500', '10', 'kg');
		expect(result).not.toBeNull();
		expect(result.totalMg).toBe('5000.00');
	});

	it('accepts boundary dosage of exactly 10000 mg/kg', () => {
		const result = calculateDosage('1', '10000', 'kg');
		expect(result).not.toBeNull();
		expect(result.totalMg).toBe('10000.00');
	});

	it('formats total mg to 2 decimal places', () => {
		const result = calculateDosage('1', '3', 'kg');
		expect(result.totalMg).toBe('3.00');
	});
});

describe('calculateDosage — pounds conversion', () => {
	it('converts lb to kg before calculating (1 lb)', () => {
		// 1 lb = 0.453592 kg; 10 mg/kg × 0.453592 = 4.53592 → "4.54"
		const result = calculateDosage('1', '10', 'lb');
		expect(result).not.toBeNull();
		expect(result.totalMg).toBe('4.54');
		expect(result.unit).toBe('lb');
	});

	it('converts lb to kg before calculating (70 lb)', () => {
		const weightKg = 70 * 0.453592;
		const expected = (10 * weightKg).toFixed(2);
		const result = calculateDosage('70', '10', 'lb');
		expect(result.totalMg).toBe(expected);
	});
});
