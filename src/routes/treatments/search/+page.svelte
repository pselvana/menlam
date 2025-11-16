<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';

  let data = [];
  let headers = [];
  let searchTerm = '';
  let debouncedSearchTerm = '';
  let searchableColumns = [];
  let loading = true;
  let error = null;
  let sortColumn = null;
  let sortDirection = 'asc';
  let useRegex = false;
  let regexError = null;
  
  // Pagination
  let currentPage = 1;
  let itemsPerPage = 25;
  
  // Modal
  let selectedRow = null;
  
  // Columns to search in
  const searchColumnNames = ["Illness", "Common Causative Agents"];
  
  // Debounce timer
  let debounceTimer;
  
  // Debounce search input
  $: {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedSearchTerm = searchTerm;
      currentPage = 1;
    }, 300);
  }
  
  // Load CSV file on mount
  onMount(() => {
    loadCSV();
    
    // Keyboard shortcuts
    const handleKeydown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape' && document.activeElement.id === 'search-input') {
        searchTerm = '';
        document.getElementById('search-input')?.blur();
      }
      if (e.key === 'Escape' && selectedRow !== null) {
        selectedRow = null;
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      clearTimeout(debounceTimer);
    };
  });
  
  async function loadCSV() {
    try {
      const response = await fetch('/antibiotics.csv');
      if (!response.ok) {
        throw new Error('Failed to load CSV file');
      }
      
      const text = await response.text();
      
      Papa.parse(text, {
        header: false,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            headers = results.data[0].map(h => String(h).trim());
            data = results.data.slice(1).map(row => 
              row.map(cell => cell === null || cell === undefined ? '' : String(cell))
            );
            
            searchableColumns = headers
              .map((header, idx) => searchColumnNames.includes(header) ? idx : -1)
              .filter(idx => idx !== -1);
          }
          loading = false;
        },
        error: (err) => {
          error = err.message;
          loading = false;
        }
      });
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }
  
  // Highlight matching text
  function highlightText(text, search) {
    if (!search || !text) return text;
    
    try {
      if (useRegex) {
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<mark class="bg-warning text-warning-content mark">$1</mark>');
      } else {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearch})`, 'gi');
        return text.replace(regex, '<mark class="bg-warning text-warning-content mark">$1</mark>');
      }
    } catch (e) {
      return text;
    }
  }
  
  // Filter and sort data
  $: {
    regexError = null;
    if (useRegex && debouncedSearchTerm) {
      try {
        new RegExp(debouncedSearchTerm);
      } catch (e) {
        regexError = 'Invalid regex pattern';
      }
    }
  }
  
  $: filteredData = (() => {
    let filtered = data;
    
    if (debouncedSearchTerm && !regexError) {
      filtered = data.filter(row => {
        try {
          if (useRegex) {
            const regex = new RegExp(debouncedSearchTerm, 'i');
            return searchableColumns.some(colIdx => {
              const cellValue = row[colIdx] || '';
              return regex.test(cellValue);
            });
          } else {
            const lowerSearch = debouncedSearchTerm.toLowerCase();
            return searchableColumns.some(colIdx => {
              const cellValue = row[colIdx] || '';
              return cellValue.toLowerCase().includes(lowerSearch);
            });
          }
        } catch (e) {
          return false;
        }
      });
    }
    
    if (sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn] || '';
        const bVal = b[sortColumn] || '';
        const comparison = aVal.localeCompare(bVal, undefined, { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  })();
  
  $: paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  $: totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  function toggleSort(colIdx) {
    if (sortColumn === colIdx) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = colIdx;
      sortDirection = 'asc';
    }
  }
  
  function openRowDetails(row) {
    selectedRow = row;
  }
  
  function closeModal() {
    selectedRow = null;
  }
  
  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }
</script>

<div class="container mx-auto p-4 max-w-7xl">
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">Antibiotics Database</h2>
      
      {#if loading}
        <div class="flex justify-center items-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      {:else if error}
        <div class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error: {error}</span>
        </div>
      {:else if headers.length > 0}
        <!-- Sticky Search Bar -->
        <div class="sticky top-0 z-10 bg-base-100 pb-4 space-y-4">
          <!-- Search Input -->
          <div class="form-control w-full">
            <label class="label" for="search-input">
              <span class="label-text font-semibold">
                Search in: {searchColumnNames.join(', ')}
              </span>
              <span class="label-text-alt text-xs opacity-70">Press / to focus, Esc to clear</span>
            </label>
            <div class="flex gap-2">
              <input 
                id="search-input"
                type="text" 
                bind:value={searchTerm}
                placeholder="Type to search..."
                class="input input-bordered w-full"
                class:input-error={regexError}
              />
              <button
                class="btn"
                class:btn-primary={useRegex}
                class:btn-outline={!useRegex}
                on:click={() => useRegex = !useRegex}
                title="Toggle regex search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
            </div>
            {#if regexError}
              <span class="label label-text-alt text-error">{regexError}</span>
            {/if}
          </div>
          
          <!-- Results Count and Items Per Page -->
          <div class="flex justify-between items-center flex-wrap gap-2">
            <div class="text-sm text-base-content/70">
              Showing {paginatedData.length} of {filteredData.length} results
              {#if filteredData.length !== data.length}
                (filtered from {data.length} total)
              {/if}
            </div>
            <div class="form-control">
              <label class="label cursor-pointer gap-2" for="items-per-page">
                <span class="label-text text-sm">Rows per page:</span>
                <select id="items-per-page" class="select select-bordered select-sm" bind:value={itemsPerPage} on:change={() => currentPage = 1}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Table -->
        {#if filteredData.length > 0}
          <div class="overflow-x-auto">
            <table class="table table-zebra table-pin-rows table-sm">
              <thead>
                <tr>
                  {#each headers as header, idx}
                    <th 
                      class="bg-base-200 cursor-pointer hover:bg-base-300 select-none"
                      on:click={() => toggleSort(idx)}
                    >
                      <div class="flex items-center gap-1">
                        <span>{header}</span>
                        {#if sortColumn === idx}
                          <span class="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        {/if}
                      </div>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each paginatedData as row, rowIdx}
                  <tr 
                    class="hover cursor-pointer"
                    on:click={() => openRowDetails(row)}
                  >
                    {#each row as cell, cellIdx}
                      <td>
                        {#if searchableColumns.includes(cellIdx) && debouncedSearchTerm && !regexError}
                          {@html highlightText(cell, debouncedSearchTerm)}
                        {:else}
                          {cell}
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          {#if totalPages > 1}
            <div class="flex justify-center mt-4">
              <div class="join">
                <button 
                  class="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  on:click={() => changePage(currentPage - 1)}
                >
                  «
                </button>
                
                {#if totalPages <= 7}
                  {#each Array(totalPages) as _, i}
                    <button 
                      class="join-item btn btn-sm"
                      class:btn-active={currentPage === i + 1}
                      on:click={() => changePage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  {/each}
                {:else}
                  <button 
                    class="join-item btn btn-sm"
                    class:btn-active={currentPage === 1}
                    on:click={() => changePage(1)}
                  >
                    1
                  </button>
                  
                  {#if currentPage > 3}
                    <button class="join-item btn btn-sm btn-disabled">...</button>
                  {/if}
                  
                  {#each Array(5) as _, i}
                    {@const page = Math.max(2, Math.min(totalPages - 1, currentPage - 2 + i))}
                    {#if page > 1 && page < totalPages}
                      <button 
                        class="join-item btn btn-sm"
                        class:btn-active={currentPage === page}
                        on:click={() => changePage(page)}
                      >
                        {page}
                      </button>
                    {/if}
                  {/each}
                  
                  {#if currentPage < totalPages - 2}
                    <button class="join-item btn btn-sm btn-disabled">...</button>
                  {/if}
                  
                  <button 
                    class="join-item btn btn-sm"
                    class:btn-active={currentPage === totalPages}
                    on:click={() => changePage(totalPages)}
                  >
                    {totalPages}
                  </button>
                {/if}
                
                <button 
                  class="join-item btn btn-sm"
                  disabled={currentPage === totalPages}
                  on:click={() => changePage(currentPage + 1)}
                >
                  »
                </button>
              </div>
            </div>
          {/if}
        {:else}
          <!-- Better Empty State -->
          <div class="flex flex-col items-center justify-center py-12 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="text-xl font-semibold mb-2">No results found</h3>
            <p class="text-base-content/70 text-center max-w-md">
              {#if useRegex}
                No rows match your regex pattern. Try a different pattern or disable regex mode.
              {:else}
                No rows contain "{debouncedSearchTerm}" in the searchable columns. Try a different search term.
              {/if}
            </p>
            <button class="btn btn-primary btn-sm mt-4" on:click={() => searchTerm = ''}>
              Clear Search
            </button>
          </div>
        {/if}
      {:else}
        <div class="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>No data found in CSV file</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Row Details Modal -->
{#if selectedRow !== null}
  <dialog 
    open 
    class="modal modal-open" 
    aria-label="Row details" 
    on:click={closeModal} 
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
  >
    <div class="modal-box max-w-2xl" role="document">
      <h3 class="font-bold text-lg mb-4">Row Details</h3>
      <div class="space-y-3">
        {#each headers as header, idx}
          <div class="form-control">
            <label class="label" for="detail-{idx}">
              <span class="label-text font-semibold">{header}</span>
            </label>
            <div id="detail-{idx}" class="p-3 bg-base-200 rounded-lg">
              {#if searchableColumns.includes(idx) && debouncedSearchTerm && !regexError}
                {@html highlightText(selectedRow[idx], debouncedSearchTerm)}
              {:else}
                {selectedRow[idx] || '-'}
              {/if}
            </div>
          </div>
        {/each}
      </div>
      <div class="modal-action">
        <button class="btn" on:click={closeModal}>Close</button>
      </div>
    </div>
  </dialog>
{/if}
<style>
  /* Custom styles for highlighted text */
  #mark {
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
    font-size: 1.125rem;  /* text-lg */
  }
</style>