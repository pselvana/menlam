<script>
	import { onMount } from 'svelte';
	import { guidelineConfig } from './guidelineConfig.js';

	let pagesContainer;
	let loading = $state(true);
	let errorMsg = $state(null);
	let currentPage = $state(1);
	let totalPages = $state(0);
	let scale = $state(1.5);
	let rendering = $state(false);

	/** @type {Record<number, HTMLElement>} */
	const pageRefs = {};

	const SCALE_STEP = 0.25;
	const SCALE_MIN = 0.5;
	const SCALE_MAX = 3.0;

	/** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
	let pdfDoc = null;

	/** @type {import('pdfjs-dist')} */
	let pdfjsLib = null;

	async function renderAllPages() {
		if (!pdfDoc || !pagesContainer) return;
		rendering = true;

		// Clear existing pages
		pagesContainer.innerHTML = '';
		for (const key in pageRefs) delete pageRefs[key];

		for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
			const page = await pdfDoc.getPage(pageNum);
			const viewport = page.getViewport({ scale });

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

		rendering = false;
	}

	async function loadPDF() {
		try {
			pdfjsLib = await import('pdfjs-dist');
			const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
			pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

			pdfDoc = await pdfjsLib.getDocument(guidelineConfig.pdf).promise;
			totalPages = pdfDoc.numPages;
			loading = false;

			await renderAllPages();
		} catch (e) {
			errorMsg = e.message;
			loading = false;
		}
	}

	/** @param {number} pageNum */
	function goToPage(pageNum) {
		const clamped = Math.max(1, Math.min(totalPages, pageNum));
		currentPage = clamped;
		const el = pageRefs[clamped];
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	async function zoomIn() {
		if (scale >= SCALE_MAX || rendering) return;
		scale = Math.min(SCALE_MAX, Math.round((scale + SCALE_STEP) * 100) / 100);
		await renderAllPages();
		// Restore scroll position to currentPage after re-render
		const el = pageRefs[currentPage];
		if (el) el.scrollIntoView({ block: 'start' });
	}

	async function zoomOut() {
		if (scale <= SCALE_MIN || rendering) return;
		scale = Math.max(SCALE_MIN, Math.round((scale - SCALE_STEP) * 100) / 100);
		await renderAllPages();
		const el = pageRefs[currentPage];
		if (el) el.scrollIntoView({ block: 'start' });
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

<!-- Header bar -->
<div class="navbar bg-base-200 border-b border-base-300 min-h-12 px-3 flex-shrink-0 gap-2">

	<!-- Back -->
	<div class="flex-none">
		<a href="/about" class="btn btn-ghost btn-sm gap-1">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back
		</a>
	</div>

	<!-- Title -->
	<div class="flex-1 min-w-0 hidden sm:block">
		<span class="font-semibold text-sm truncate">{guidelineConfig.title}</span>
		<span class="text-xs opacity-60 ml-2 hidden lg:inline">{guidelineConfig.subtitle}</span>
	</div>

	<!-- Page navigation -->
	{#if totalPages > 0}
		<div class="flex items-center gap-1 flex-none">
			<button
				class="btn btn-ghost btn-xs"
				title="First page"
				disabled={currentPage <= 1 || rendering}
				onclick={() => goToPage(1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
				</svg>
			</button>
			<button
				class="btn btn-ghost btn-xs"
				title="Previous page"
				disabled={currentPage <= 1 || rendering}
				onclick={() => goToPage(currentPage - 1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<span class="text-xs tabular-nums px-1 min-w-[5rem] text-center">
				{currentPage} / {totalPages}
			</span>

			<button
				class="btn btn-ghost btn-xs"
				title="Next page"
				disabled={currentPage >= totalPages || rendering}
				onclick={() => goToPage(currentPage + 1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
			<button
				class="btn btn-ghost btn-xs"
				title="Last page"
				disabled={currentPage >= totalPages || rendering}
				onclick={() => goToPage(totalPages)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Divider -->
			<div class="w-px h-5 bg-base-300 mx-1"></div>

			<!-- Zoom -->
			<button
				class="btn btn-ghost btn-xs"
				title="Zoom out"
				disabled={scale <= SCALE_MIN || rendering}
				onclick={zoomOut}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM8 11h6" />
				</svg>
			</button>
			<span class="text-xs tabular-nums min-w-[2.5rem] text-center">{Math.round(scale * 100 / 1.5)}%</span>
			<button
				class="btn btn-ghost btn-xs"
				title="Zoom in"
				disabled={scale >= SCALE_MAX || rendering}
				onclick={zoomIn}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6" />
				</svg>
			</button>
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
							title={item.title}
							class="w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-start justify-between gap-2 hover:bg-base-300
								{currentPage === item.page ? 'bg-primary text-primary-content font-medium' : 'text-base-content'}"
							onclick={() => goToPage(item.page)}
						>
							<span class="leading-snug line-clamp-2">{item.title}</span>
							<span class="text-xs opacity-50 flex-shrink-0 mt-0.5">{item.label}</span>
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

		{#if rendering}
			<div class="absolute top-4 right-4 z-10">
				<span class="loading loading-spinner loading-sm text-primary"></span>
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
