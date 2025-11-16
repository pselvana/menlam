<script>
  import { onMount } from 'svelte';
  import Papa from 'papaparse';

  let data = [];
  let headers = [];
  let searchTerm = '';
  let searchableColumns = []; // Array of column indices to search
  let loading = true;
  let error = null;
  
  // Columns to search in
  const searchColumnNames = ["Illness", "Common Causative Agents"];
  
  // Load CSV file on mount
  onMount(async () => {
    try {
      const response = await fetch('/antibiotics.csv');
      if (!response.ok) {
        throw new Error('Failed to load CSV file');
      }
      
      const text = await response.text();
      
      // Parse CSV with PapaParse
      Papa.parse(text, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // First row is headers
            headers = results.data[0].map(h => String(h).trim());
            // Remaining rows are data
            data = results.data.slice(1).map(row => 
              row.map(cell => cell === null || cell === undefined ? '' : String(cell))
            );
            
            // Set searchable columns to only "Illness" and "Common Causative Agents"
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
  });
  
  // Toggle column searchability
  function toggleColumn(idx) {
    if (searchableColumns.includes(idx)) {
      searchableColumns = searchableColumns.filter(i => i !== idx);
    } else {
      searchableColumns = [...searchableColumns, idx];
    }
  }
  
  // Filter data based on search term
  $: filteredData = data.filter(row => {
    if (!searchTerm) return true;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return searchableColumns.some(colIdx => {
      const cellValue = row[colIdx] || '';
      return cellValue.toLowerCase().includes(lowerSearch);
    });
  });
</script>

<div class="container mx-auto p-4 max-w-6xl">
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
        <!-- Search Input -->
        <div class="form-control w-full mb-4">
          <label class="label" for="search-input">
            <span class="label-text">Search</span>
          </label>
          <input 
            id="search-input"
            type="text" 
            bind:value={searchTerm}
            placeholder="Type to search..."
            class="input input-bordered w-full"
          />
        </div>
        
        <!-- Column Selection -->
        <div class="mb-4">
          <p class="text-sm font-semibold mb-2">Search in columns:</p>
          <div class="flex flex-wrap gap-2">
            {#each headers as header, idx}
              <button
                on:click={() => toggleColumn(idx)}
                class="btn btn-sm"
                class:btn-primary={searchableColumns.includes(idx)}
                class:btn-outline={!searchableColumns.includes(idx)}
              >
                {header}
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Results Count -->
        <div class="text-sm text-base-content/70 mb-2">
          Showing {filteredData.length} of {data.length} rows
        </div>
        
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="table table-zebra table-pin-rows">
            <thead>
              <tr>
                {#each headers as header}
                  <th class="bg-base-200">{header}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each filteredData as row}
                <tr>
                  {#each row as cell}
                    <td>{cell}</td>
                  {/each}
                </tr>
              {:else}
                <tr>
                  <td colspan={headers.length} class="text-center text-base-content/50">
                    No results found
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
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