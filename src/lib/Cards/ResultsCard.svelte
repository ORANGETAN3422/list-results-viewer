<script>
    import { getColor, formatKey } from "../../helpers/dataAnalyse";
    import SearchBar from "../SearchBar.svelte";

    export let selectedItem = { name: "", ratings: {}, stats: {} };
    export let selectedIndex = 0;
    export let allStats = [];
    export let sortOrder = "none";
    export let onSortToggle = () => {};
    export let onSelectChange = () => {};

    function previousItem() {
    if (selectedIndex > 0) {
        selectedIndex--;
        onSelectChange();
        }
    }

    function nextItem() {
    if (selectedIndex < allStats.length - 1) {
        selectedIndex++;
        onSelectChange();
        }
    }

    $: originalRatings = Object.entries(selectedItem.ratings);

    $: sortedRatings =
        sortOrder === "none"
            ? originalRatings
            : [...originalRatings].sort((a, b) =>
                  sortOrder === "desc" ? b[1] - a[1] : a[1] - b[1],
              );
</script>

<div class="card">
   <div class="top-controls">
    <SearchBar
        items={allStats}
        bind:selectedIndex
        on:change={() => onSelectChange()}
    />

    <button
        class="nav-btn"
        on:click={previousItem}
        disabled={selectedIndex === 0}
    >
        ◀
    </button>

    <button
        class="nav-btn"
        on:click={nextItem}
        disabled={selectedIndex === allStats.length - 1}
    >
       ▶
    </button>
</div>

    <h3>{formatKey(selectedItem.name)}</h3>

    <button on:click={onSortToggle} class="sort-btn">
        Sort:
        {#if sortOrder === "desc"}
            Descending
        {:else if sortOrder === "asc"}
            Ascending
        {:else}
            Default
        {/if}
    </button>

    {#if Object.keys(selectedItem.ratings).length > 0}
        {#each sortedRatings as [levelName, value]}
            <div class="rating-row">
                <span class="level-name">{formatKey(levelName)}</span>
                <span class="level-value" style="color: {getColor(value)}"
                    >{value}</span
                >
            </div>
        {/each}
    {:else}
        <p>No ratings found.</p>
    {/if}
</div>

<style>
    .top-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.top-controls :global(.search-bar) {
    flex: 1;
}

.nav-btn {
    padding: 0.4rem 0.8rem;
    white-space: nowrap;
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>