<script>
	import { onMount } from 'svelte';
	import { guidelineConfig } from './guidelineConfig.js';

	let pagesContainer;
	let loading = $state(true);
	let errorMsg = $state(null);
	let currentPage = $state(1);
	let totalPages = $state(0);

	/** @type {Record<number, HTMLElement>} */
	const pageRefs = {};

	const SCALE = 1.5;

	async function loadPDF() {
		try {
			const pdfjsLib = await import('pdfjs-dist');

			// Use the bundled worker via Vite's ?url import
			const workerUrl = new URL(
				'pdfjs-dist/build/pdf.worker.min.mjs',
				import.meta.url
			).href;
			pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

			const pdfDoc = await pdfjsLib.getDocument(guidelineConfig.pdf).promise;
			totalPages = pdfDoc.numPages;
			loading = false;

			for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
				const page = await pdfDoc.getPage(pageNum);
				const viewport = page.getViewport({ scale: SCALE });

				const wrapper = document.createElement('div');
				wrapper.id = `pdf-page-${pageNum}`;
				wrapper.className = 'shadow-lg mb-3 flex-shrink-0';

				const canvas = document.createElement('canvas');
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				canvas.className = 'block';

				wrapper.appendChild(canvas);
				pagesContainer.appendChild(wrapper);
				pageRefs[pageNum] = wrapper;

				const ctx = canvas.getContext('2d');
				await page.render({ canvasContext: ctx, viewport }).promise;
			}
		} catch (e) {
			errorMsg = e.message;
			loading = false;
		}
	}

	/** @param {number} pageNum */
	function goToPage(pageNum) {
		currentPage = pageNum;
		const el = pageRefs[pageNum];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/** Update currentPage as user scrolls */
	function onScroll(e) {
		const scrollTop = e.currentTarget.scrollTop;
		for (let p = totalPages; p >= 1; p--) {
			const el = pageRefs[p];
			if (el && el.offsetTop <= scrollTop + 80) {
				if (currentPage !== p) currentPage = p;
				break;
			}
		}
	}

	onMount(() => {
		loadPDF();
	});
</script>

<!-- Compact header bar -->
<div class="navbar bg-base-200 border-b border-base-300 min-h-12 px-4 flex-shrink-0">
	<div class="flex-none mr-3">
		<a href="/about" class="btn btn-ghost btn-sm gap-1">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back
		</a>
	</div>
	<div class="flex-1 min-w-0">
		<span class="font-semibold text-sm truncate">{guidelineConfig.title}</span>
		<span class="text-xs opacity-60 ml-2 hidden sm:inline">{guidelineConfig.subtitle}</span>
	</div>
	{#if totalPages > 0}
		<div class="flex-none text-xs opacity-60 ml-2">
			Page {currentPage} / {totalPages}
		</div>
	{/if}
</div>

<!-- Main two-column layout -->
<div class="flex flex-1 overflow-hidden">

	<!-- Sidebar: table of contents -->
	<aside class="w-64 bg-base-200 border-r border-base-300 overflow-y-auto flex-shrink-0 hidden md:block">
		<div class="p-3">
			<p class="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 px-2">Contents</p>
			<ul class="space-y-0.5">
				{#each guidelineConfig.tableOfContents as item}
					<li>
						<button
							class="w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between gap-2 hover:bg-base-300
								{currentPage === item.page ? 'bg-primary text-primary-content font-medium' : 'text-base-content'}"
							onclick={() => goToPage(item.page)}
						>
							<span class="truncate">{item.title}</span>
							<span class="text-xs opacity-50 flex-shrink-0">{item.label}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</aside>

	<!-- PDF viewer -->
	<div class="flex-1 overflow-y-auto bg-base-300 relative" onscroll={onScroll}>
		{#if loading}
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-300 z-10">
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="text-sm opacity-60">Loading PDF…</p>
			</div>
		{/if}

		{#if errorMsg}
			<div class="p-6">
				<div class="alert alert-error">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>Could not load PDF: {errorMsg}</span>
				</div>
			</div>
		{/if}

		<div bind:this={pagesContainer} class="flex flex-col items-center py-4 px-2"></div>
	</div>

</div>
