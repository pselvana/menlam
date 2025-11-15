import Papa from 'papaparse';

export async function loadCSV() {
	const response = await fetch('/antibiotics.csv');
	const text = await response.text();
	const result = Papa.parse(text, {
		header: true, // if your CSV has headers
		skipEmptyLines: true
	});
	return result.data;
}
