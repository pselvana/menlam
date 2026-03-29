import { describe, it, expect } from 'vitest';
import {
	getSections,
	getInfections,
	getSectionRemarks,
	getInfectionRemarks,
	getFinalRows,
	highlightText
} from './treatmentUtils.js';

const CSV = [
	{
		Patient: 'Adult',
		Section: 'BONE AND JOINT',
		'Section Remarks': 'Obtain cultures',
		Infection: 'Osteomyelitis',
		'Infection Remarks': '',
		Type: '',
		'Recommended Antibiotic Therapy': 'Cloxacillin'
	},
	{
		Patient: 'Adult',
		Section: 'BONE AND JOINT',
		'Section Remarks': '',
		Infection: 'Septic Arthritis',
		'Infection Remarks': 'Consider MRSA',
		Type: '',
		'Recommended Antibiotic Therapy': 'Vancomycin'
	},
	{
		Patient: 'Adult',
		Section: 'RESPIRATORY',
		'Section Remarks': '',
		Infection: 'Pneumonia',
		'Infection Remarks': '',
		Type: '',
		'Recommended Antibiotic Therapy': 'Amoxicillin'
	}
];

describe('getSections', () => {
	it('returns sorted unique sections for a patient', () => {
		expect(getSections(CSV, 'Adult')).toEqual(['BONE AND JOINT', 'RESPIRATORY']);
	});

	it('returns empty array for unknown patient', () => {
		expect(getSections(CSV, 'Pediatric')).toEqual([]);
	});
});

describe('getInfections', () => {
	it('returns sorted unique infections for patient+section', () => {
		expect(getInfections(CSV, 'Adult', 'BONE AND JOINT')).toEqual([
			'Osteomyelitis',
			'Septic Arthritis'
		]);
	});

	it('returns empty array for unknown section', () => {
		expect(getInfections(CSV, 'Adult', 'CARDIOLOGY')).toEqual([]);
	});
});

describe('getSectionRemarks', () => {
	it('returns the section remark when present', () => {
		expect(getSectionRemarks(CSV, 'Adult', 'BONE AND JOINT')).toBe('Obtain cultures');
	});

	it('returns empty string when no remark exists', () => {
		expect(getSectionRemarks(CSV, 'Adult', 'RESPIRATORY')).toBe('');
	});
});

describe('getInfectionRemarks', () => {
	it('returns the infection remark when present', () => {
		expect(getInfectionRemarks(CSV, 'Adult', 'BONE AND JOINT', 'Septic Arthritis')).toBe(
			'Consider MRSA'
		);
	});

	it('returns empty string when no remark exists', () => {
		expect(getInfectionRemarks(CSV, 'Adult', 'BONE AND JOINT', 'Osteomyelitis')).toBe('');
	});
});

describe('getFinalRows', () => {
	it('strips all metadata columns', () => {
		const rows = getFinalRows(CSV, 'Adult', 'BONE AND JOINT', 'Osteomyelitis');
		expect(rows).toHaveLength(1);
		expect(rows[0]).not.toHaveProperty('Patient');
		expect(rows[0]).not.toHaveProperty('Section');
		expect(rows[0]).not.toHaveProperty('Section Remarks');
		expect(rows[0]).not.toHaveProperty('Infection');
		expect(rows[0]).not.toHaveProperty('Infection Remarks');
		expect(rows[0]).toHaveProperty('Recommended Antibiotic Therapy', 'Cloxacillin');
	});

	it('returns only rows matching all three criteria', () => {
		const rows = getFinalRows(CSV, 'Adult', 'BONE AND JOINT', 'Septic Arthritis');
		expect(rows).toHaveLength(1);
		expect(rows[0]['Recommended Antibiotic Therapy']).toBe('Vancomycin');
	});

	it('returns empty array when no match', () => {
		expect(getFinalRows(CSV, 'Adult', 'RESPIRATORY', 'Osteomyelitis')).toHaveLength(0);
	});
});

describe('highlightText', () => {
	it('wraps a match in a mark tag (case-insensitive)', () => {
		const result = highlightText('Amoxicillin', 'amoxicillin', false);
		expect(result).toContain('<mark');
		expect(result).toContain('Amoxicillin');
	});

	it('returns original text when search is empty', () => {
		expect(highlightText('Amoxicillin', '')).toBe('Amoxicillin');
	});

	it('returns original text when text is empty', () => {
		expect(highlightText('', 'amox')).toBe('');
	});

	it('escapes regex special characters in literal mode', () => {
		// '.' should match literally, not any character
		const result = highlightText('a.b', '.', false);
		expect(result).toContain('<mark');
		// 'axb' should NOT be highlighted when searching for literal '.'
		expect(highlightText('axb', '.', false)).toBe('axb');
	});

	it('uses raw regex pattern in regex mode', () => {
		const result = highlightText('Amoxicillin 500mg', '\\d+', true);
		expect(result).toContain('<mark');
		expect(result).toContain('500');
	});

	it('returns original text on invalid regex without throwing', () => {
		const result = highlightText('some text', '[invalid', true);
		expect(result).toBe('some text');
	});

	it('highlights all occurrences', () => {
		const result = highlightText('aaa', 'a', false);
		const count = (result.match(/<mark/g) || []).length;
		expect(count).toBe(3);
	});
});
