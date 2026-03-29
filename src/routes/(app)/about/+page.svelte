<script>
	import { onMount } from 'svelte';

	let visible = false;
	onMount(() => {
		setTimeout(() => (visible = true), 50);
	});

	const contributors = [
		{ name: 'Dr. G.P. Dhakal', role: 'Gastroenterologist', initials: 'GPD' },
		{ name: 'Dr. Kuenley Pedon', role: 'Paediatrician', initials: 'KP' },
		{ name: 'Dr. Kunga Penjor', role: 'Prosthodontist', initials: 'KP' },
		{ name: 'Dr. Mahesh Gurung', role: 'Cardiologist', initials: 'MG' },
		{ name: 'Dr. Pem Chuki', role: 'Clinical Pharmacologist', initials: 'PC' },
		{ name: 'Dr. Sonam Jamtsho', role: 'Gynaecologist', initials: 'SJ' },
		{ name: 'Dr. Tashi Tenzin', role: 'Neurosurgeon', initials: 'TT' },
		{ name: 'Dr. Ugyen Tshering', role: 'Emergency Physician', initials: 'UT' },
		{ name: 'Dr. Ugyen Thinley', role: 'Orthopaedic Surgeon', initials: 'UT' },
		{ name: 'Dr. Yoriko Nishizawa', role: 'Neonatologist, KGUMSB', initials: 'YN' },
		{ name: 'Mr. Raghunath Sharma', role: 'Laboratory Officer', initials: 'RS' },
		{ name: 'Mr. Thupten Tshering', role: 'Clinical Pharmacist', initials: 'TT' },
	];

	let showAcknowledgements = false;
</script>

<!-- Hero -->
<div
	class="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-600 text-white px-6 py-16 text-center transition-all duration-700"
	class:opacity-0={!visible}
	class:opacity-100={visible}
>
	<div class="absolute inset-0 opacity-10 pointer-events-none select-none text-[12rem] leading-none flex items-center justify-center">
		🇧🇹
	</div>
	<div class="relative z-10 max-w-2xl mx-auto">
		<div class="badge badge-warning badge-lg mb-4 font-semibold tracking-wide">Medical Reference Tool</div>
		<h1 class="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
			Bhutan Infectious Disease Guidelines
		</h1>
		<p class="text-emerald-100 text-lg max-w-xl mx-auto">
			Quick, evidence-based antibiotic guidance for medical professionals in Bhutan — built to support better prescribing decisions at the point of care.
		</p>
	</div>
</div>

<!-- Stats -->
<div
	class="bg-base-200 py-8 px-6 transition-all duration-700 delay-100 items-center justify-center flex"
	class:opacity-0={!visible}
	class:translate-y-4={!visible}
	class:opacity-100={visible}
	class:translate-y-0={visible}
>
	<div class="stats stats-vertical sm:stats-horizontal shadow w-full max-w-3xl mx-auto bg-base-100">
		<div class="stat">
			<div class="stat-figure text-primary text-3xl">📋</div>
			<div class="stat-title">Guideline Edition</div>
			<div class="stat-value text-primary">3rd</div>
			<div class="stat-desc">National Antibiotic Guideline 2018</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-secondary text-3xl">🏥</div>
			<div class="stat-title">Source</div>
			<div class="stat-value text-secondary text-2xl">MoH</div>
			<div class="stat-desc">Ministry of Health, Bhutan</div>
		</div>
		<div class="stat">
			<div class="stat-figure text-accent text-3xl">👨‍⚕️</div>
			<div class="stat-title">Contributors</div>
			<div class="stat-value text-accent">12+</div>
			<div class="stat-desc">Specialists from JDWNRH</div>
		</div>
	</div>
</div>

<!-- Main content -->
<div
	class="max-w-3xl mx-auto px-6 py-10 space-y-10 transition-all duration-700 delay-200"
	class:opacity-0={!visible}
	class:translate-y-4={!visible}
	class:opacity-100={visible}
	class:translate-y-0={visible}
>

	<!-- Purpose card -->
	<div class="card bg-base-100 shadow border border-base-300">
		<div class="card-body">
			<h2 class="card-title text-xl">
				<span class="text-2xl">💊</span> Purpose
			</h2>
			<p class="text-base-content/80">
				This tool was created by <strong>Dr. Vamini Selvanandan</strong> to facilitate quick access to
				treatment guidelines from the <em>National Antibiotic Guideline 2018</em> published by the
				Ministry of Health, Bhutan. It is intended for use by medical professionals and should not
				replace clinical judgement or national standards of care.
			</p>
		</div>
	</div>

	<!-- AMR awareness -->
	<div class="card bg-warning/10 border border-warning/40 shadow">
		<div class="card-body">
			<h2 class="card-title text-xl">
				<span class="text-2xl">🦠</span> Why This Matters
			</h2>
			<div class="grid sm:grid-cols-3 gap-4 mt-2 text-center">
				<div class="rounded-xl bg-base-100 p-4 shadow-sm">
					<div class="text-3xl font-bold text-warning">50%+</div>
					<div class="text-sm text-base-content/70 mt-1">of hospital antimicrobial use is inappropriate globally</div>
				</div>
				<div class="rounded-xl bg-base-100 p-4 shadow-sm">
					<div class="text-3xl font-bold text-error">90%+</div>
					<div class="text-sm text-base-content/70 mt-1">of surgical prophylaxis antibiotics are inappropriate in developing countries</div>
				</div>
				<div class="rounded-xl bg-base-100 p-4 shadow-sm">
					<div class="text-3xl font-bold text-primary">$5.6M</div>
					<div class="text-sm text-base-content/70 mt-1">estimated annual cost per hospital due to antimicrobial resistance</div>
				</div>
			</div>
			<p class="text-sm text-base-content/70 mt-3">
				Rational antibiotic prescribing minimises morbidity, mortality, and cost from resistant infections — the core mission behind these guidelines.
			</p>
		</div>
	</div>

	<!-- Foreword -->
	<div class="collapse collapse-arrow bg-base-100 border border-base-300 shadow">
		<input type="checkbox" />
		<div class="collapse-title font-semibold text-base flex items-center gap-2">
			<span class="text-xl">📜</span> Foreword
		</div>
		<div class="collapse-content text-sm text-base-content/80 leading-relaxed space-y-3">
			<p>
				Antimicrobial resistance (AMR) has emerged as a major public health issue all over the world.
				Though it is a global problem, the major brunt of AMR is borne by developing countries. It is
				estimated that 50% or more of hospital antimicrobial use is inappropriate and more alarming was
				from the developing countries, where more than 90% of antibiotics used in surgical prophylaxis
				were inappropriate.
			</p>
			<p>
				This results in treatment failure or ineffective management of infectious diseases. Antimicrobial
				resistance makes the treatment of patients difficult, costly and sometimes impossible. Resistance
				has emerged even to newer and more potent antimicrobial agents like carbapenems. It has been
				reported that almost USD 5.6 million per year per hospital is spent because of AMR.
			</p>
			<p>
				An important strategy in combatting the development and spread of antimicrobial resistance is
				optimisation of prescribing of antimicrobials in all clinical settings, ensuring antimicrobials are
				prescribed and utilised according to principles of evidence based medicine.
			</p>
			<p>
				Therefore, rational prescription of antibiotics not only will help minimize the morbidity and
				mortality due to resistant microbial infections but also curtail the cost incurred on patient
				management. In line with the rational prescription of antibiotics, Essential Medicines &amp;
				Technology Division, Department of Medical Services under the guidance of the national experts
				from Jigme Dorji Wangchuck National Referral Hospital (JDWNRH) have come up with the 3rd
				Edition of the National Antibiotic Guideline based on scientific evidence, literature review and
				consistent with the already existing international guidelines as well as the local antibiogram of
				JDWNRH.
			</p>
			<p>
				The treatment recommendations in this guideline for infectious diseases are grouped by organ
				systems and presented in a tabular format for ease of use. Brief descriptions of disease
				categories with their etiologic agents, corresponding antibiotic regimens (dose, route,
				frequency and duration) for adult, paediatric and neonate patients, with relevant comments are
				presented. A section on surgical prophylaxis has been added since antibiotic misuse to prevent
				surgical site infections also needs urgent attention.
			</p>
			<p>We are confident that the guideline will rationalize the usage of antibiotics and establish consistency in the treatment of various infectious conditions in the country.</p>
			<p class="font-medium">
				— Dr. Pandup Tshering<br />
				<span class="text-base-content/60 font-normal">Director General, Department of Medical Services</span>
			</p>
		</div>
	</div>

	<!-- Acknowledgements -->
	<div class="bg-base-100 border border-base-300 shadow rounded-2xl">
		<button
			class="w-full flex items-center justify-between gap-2 px-4 py-4 font-semibold text-base text-left"
			on:click={() => (showAcknowledgements = !showAcknowledgements)}
		>
			<span class="flex items-center gap-2"><span class="text-xl">🙏</span> Acknowledgements</span>
			<svg
				class="w-4 h-4 transition-transform duration-200 shrink-0"
				class:rotate-180={showAcknowledgements}
				xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		{#if showAcknowledgements}
			<div class="px-4 pb-4">
				<p class="text-sm text-base-content/70 mb-3">
					Contributions to the 3rd edition have been made by the following specialists from JDWNRH and KGUMSB:
				</p>
				<div class="grid sm:grid-cols-2 gap-2">
					{#each contributors as contributor}
						<div class="flex items-center gap-3 rounded-lg bg-base-200 px-3 py-2">
							<div class="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center text-xs font-semibold shrink-0">
								{contributor.initials}
							</div>
							<div>
								<div class="text-sm font-medium">{contributor.name}</div>
								<div class="text-xs text-base-content/60">{contributor.role}</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4 text-sm text-base-content/70">
					<strong>Secretariat, layout &amp; cover design:</strong> Ugyen Tashi, Dy. Chief Pharmacist, EMTD
				</div>
			</div>
		{/if}
	</div>

	<!-- CTA -->
	<div class="card bg-primary text-primary-content shadow-lg">
		<div class="card-body flex-row flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="card-title">Read the full guideline</h2>
				<p class="opacity-80 text-sm">National Antibiotic Guideline 2018</p>
			</div>
			<div class="flex gap-3 flex-wrap">
				<a href="/guideline" class="btn btn-sm bg-white text-primary hover:bg-emerald-50 border-0">
					View PDF
				</a>
				<a href="/docs/National-Antibiotic-Guideline-2018.pdf" target="_blank" class="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-primary">
					Download
				</a>
			</div>
		</div>
	</div>

</div>
