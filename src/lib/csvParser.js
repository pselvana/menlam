export function parseCSV(text) {
	const rows = text
		.split(/\r?\n/)
		.filter(Boolean)
		.map((r) => r.split(','));

	const headers = rows[0];
	const data = rows.slice(1).map((row) => {
		let obj = {};
		headers.forEach((h, i) => (obj[h.trim()] = row[i] ? row[i].trim() : ''));
		return obj;
	});

	return data;
}
