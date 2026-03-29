/**
 * Get unique sorted section names for a given patient.
 * @param {object[]} csv
 * @param {string} patient
 * @returns {string[]}
 */
export function getSections(csv, patient) {
	return [...new Set(csv.filter((r) => r.Patient === patient).map((r) => r.Section))].sort();
}

/**
 * Get unique sorted infection names for a given patient and section.
 * @param {object[]} csv
 * @param {string} patient
 * @param {string} section
 * @returns {string[]}
 */
export function getInfections(csv, patient, section) {
	return [
		...new Set(
			csv.filter((r) => r.Patient === patient && r.Section === section).map((r) => r.Infection)
		)
	].sort();
}

/**
 * Get the section remarks string for a given patient and section.
 * @param {object[]} csv
 * @param {string} patient
 * @param {string} section
 * @returns {string}
 */
export function getSectionRemarks(csv, patient, section) {
	const row = csv.find(
		(r) => r.Patient === patient && r.Section === section && r['Section Remarks']
	);
	return row ? row['Section Remarks'] : '';
}

/**
 * Get the infection remarks string for a given patient, section, and infection.
 * @param {object[]} csv
 * @param {string} patient
 * @param {string} section
 * @param {string} infection
 * @returns {string}
 */
export function getInfectionRemarks(csv, patient, section, infection) {
	const row = csv.find(
		(r) =>
			r.Patient === patient &&
			r.Section === section &&
			r.Infection === infection &&
			r['Infection Remarks']
	);
	return row ? row['Infection Remarks'] : '';
}

/**
 * Get treatment rows for a patient/section/infection with metadata columns stripped.
 * Strips: Patient, Section, Section Remarks, Infection, Infection Remarks.
 * @param {object[]} csv
 * @param {string} patient
 * @param {string} section
 * @param {string} infection
 * @returns {object[]}
 */
export function getFinalRows(csv, patient, section, infection) {
	return csv
		.filter((r) => r.Patient === patient && r.Section === section && r.Infection === infection)
		.map(
			({
				Patient,
				Section,
				'Section Remarks': _sr,
				Infection,
				'Infection Remarks': _ir,
				...rest
			}) => rest
		);
}

/**
 * Wrap matches in a <mark> tag. Returns original text for empty search or on regex error.
 * @param {string} text
 * @param {string} search
 * @param {boolean} useRegex
 * @returns {string}
 */
export function highlightText(text, search, useRegex = false) {
	if (!search || !text) return text;
	try {
		const pattern = useRegex ? search : search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`(${pattern})`, 'gi');
		return text.replace(
			regex,
			'<mark class="bg-warning text-warning-content mark">$1</mark>'
		);
	} catch {
		return text;
	}
}
