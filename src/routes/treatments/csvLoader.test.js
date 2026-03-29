import { describe, it, expect, vi, beforeEach } from 'vitest';

const MOCK_CSV_TEXT = 'Patient,Section\nAdult,BONE AND JOINT';
const MOCK_PARSED = [{ Patient: 'Adult', Section: 'BONE AND JOINT' }];

describe('csvLoader.loadCSV', () => {
	let loadCSV;
	let storage;

	beforeEach(async () => {
		vi.resetModules();

		storage = {};
		vi.stubGlobal('sessionStorage', {
			getItem: vi.fn((k) => storage[k] ?? null),
			setItem: vi.fn((k, v) => {
				storage[k] = v;
			}),
			removeItem: vi.fn((k) => {
				delete storage[k];
			})
		});

		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve({ text: () => Promise.resolve(MOCK_CSV_TEXT) }))
		);

		({ loadCSV } = await import('./csvLoader.js'));
	});

	it('fetches from network on first call', async () => {
		const result = await loadCSV();
		expect(globalThis.fetch).toHaveBeenCalledWith('/antibiotics.csv');
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toHaveProperty('Patient', 'Adult');
	});

	it('stores result in sessionStorage after fetch', async () => {
		await loadCSV();
		expect(sessionStorage.setItem).toHaveBeenCalledOnce();
	});

	it('uses memory cache on second call — no additional fetch', async () => {
		await loadCSV();
		await loadCSV();
		expect(globalThis.fetch).toHaveBeenCalledOnce();
	});

	it('reads from sessionStorage when available — skips network fetch', async () => {
		storage['antibiotics_csv_cache'] = JSON.stringify(MOCK_PARSED);

		vi.resetModules();
		({ loadCSV } = await import('./csvLoader.js'));

		const result = await loadCSV();
		expect(globalThis.fetch).not.toHaveBeenCalled();
		expect(result).toEqual(MOCK_PARSED);
	});
});
