<script>
    export let items = [];
    export let selectedIndex = 0;
    export let onSelect = (index) => {};

    let searchTerm = "";
    let isOpen = false;
    let highlightedIndex = -1;

    $: filteredItems = items
        .map((item, index) => ({ ...item, originalIndex: index }))
        .filter(({ name }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

    function handleSelect(originalIndex) {
        selectedIndex = originalIndex;
        searchTerm = items[originalIndex].name;
        onSelect(originalIndex);
        isOpen = false;
        highlightedIndex = -1;
    }

    function handleKeyDown(e) {
        if (!isOpen) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            highlightedIndex = (highlightedIndex + 1) % filteredItems.length;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            highlightedIndex =
                (highlightedIndex - 1 + filteredItems.length) %
                filteredItems.length;
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            handleSelect(filteredItems[highlightedIndex].originalIndex);
        } else if (e.key === "Escape") {
            isOpen = false;
            highlightedIndex = -1;
        }
    }

    function handleInput() {
        isOpen = true;
        highlightedIndex = -1;
    }
</script>

<div class="search-bar" on:keydown={handleKeyDown}>
    <input
        type="text"
        placeholder="Search..."
        bind:value={searchTerm}
        class="search-input"
        on:input={handleInput}
        on:focus={() => (isOpen = true)}
        on:blur={() => setTimeout(() => (isOpen = false), 100)}
    />

    {#if isOpen && filteredItems.length > 0}
        <ul class="search-list">
            {#each filteredItems as item, index (item.originalIndex)}
                <li
                    class:selected={index === highlightedIndex}
                    on:mousedown={() => handleSelect(item.originalIndex)}
                >
                    {item.name}
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .search-bar {
        position: relative;
        width: 100%;
    }
    .search-input {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
        font-weight: bold;
        border-radius: 5px;
        outline: none;
    }
    .search-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
        background: rgb(39, 39, 39);
        position: absolute;
        width: 100%;
        z-index: 10;
        border-radius: 5px;
        font-size: 0.9em;
        text-align: left;
    }
    .search-list li {
        padding: 0.2rem;
        cursor: pointer;
    }
    .search-list li.selected,
    .search-list li:hover {
        background-color: #575757;
    }
</style>
