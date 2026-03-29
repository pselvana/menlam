import Papa from 'papaparse';

const CACHE_KEY = 'antibiotics_csv_cache';
let memoryCache = null;

export async function loadCSV() {
	if (memoryCache) return memoryCache;

	const cached = sessionStorage.getItem(CACHE_KEY);
	if (cached) {
		memoryCache = JSON.parse(cached);
		return memoryCache;
	}

	const response = await fetch('/antibiotics.csv');
	const text = await response.text();
	const result = Papa.parse(text, {
		header: true,
		skipEmptyLines: true
	});

	memoryCache = result.data;
	sessionStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
	return memoryCache;
}
