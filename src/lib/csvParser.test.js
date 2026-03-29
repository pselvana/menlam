import { describe, it, expect } from 'vitest';
import { parseCSV } from './csvParser.js';

describe('parseCSV', () => {
	it('parses a simple CSV with headers', () => {
		const result = parseCSV('name,age\nAlice,30\nBob,25');
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ name: 'Alice', age: '30' });
		expect(result[1]).toEqual({ name: 'Bob', age: '25' });
	});

	it('trims whitespace from headers and values', () => {
		const result = parseCSV(' name , age \n Alice , 30 ');
		expect(result[0]).toEqual({ name: 'Alice', age: '30' });
	});

	it('returns empty string for missing cells', () => {
		const result = parseCSV('a,b,c\n1,,3');
		expect(result[0]).toEqual({ a: '1', b: '', c: '3' });
	});

	it('handles Windows CRLF line endings', () => {
		const result = parseCSV('name,age\r\nAlice,30\r\nBob,25');
		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('Alice');
		expect(result[1].name).toBe('Bob');
	});

	it('ignores blank lines', () => {
		const result = parseCSV('name,age\nAlice,30\n\nBob,25\n');
		expect(result).toHaveLength(2);
	});

	it('returns empty array for header-only input', () => {
		expect(parseCSV('name,age')).toHaveLength(0);
	});

	it('handles a single column', () => {
		const result = parseCSV('drug\nAmoxicillin\nVancomycin');
		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ drug: 'Amoxicillin' });
	});
});
