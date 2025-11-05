<script>
    export let items = [];
    export let selectedIndex = 0;
    export let onSelect = (index) => {};

    let searchTerm = "";
    let isOpen = false;
    let highlightedIndex = -1;
    let inputEl;
    let listEl;

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
            scrollToHighlighted();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            highlightedIndex =
                (highlightedIndex - 1 + filteredItems.length) %
                filteredItems.length;
            scrollToHighlighted();
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            handleSelect(filteredItems[highlightedIndex].originalIndex);
        } else if (e.key === "Escape") {
            isOpen = false;
            highlightedIndex = -1;
        }
    }

    function scrollToHighlighted() {
        if (!listEl || highlightedIndex < 0) return;
        const li = listEl.children[highlightedIndex];
        if (li) li.scrollIntoView({ block: "nearest" });
    }

    function handleInput() {
        isOpen = true;
        highlightedIndex = -1;
    }

    function clearSearch() {
        searchTerm = "";
        isOpen = true;
        highlightedIndex = -1;
        inputEl.focus();
    }

    function handleFocus() {
        isOpen = true;
        inputEl.select();
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="search-bar" on:keydown={handleKeyDown}>
    <div class="input-wrapper">
        <input
            bind:this={inputEl}
            type="text"
            placeholder="Search..."
            bind:value={searchTerm}
            class="search-input"
            on:input={handleInput}
            on:focus={handleFocus}
            on:blur={() => setTimeout(() => (isOpen = false), 100)}
        />
        {#if searchTerm}
            <button class="clear-btn" on:mousedown|preventDefault={clearSearch}>
                ×
            </button>
        {/if}
    </div>

    {#if isOpen && filteredItems.length > 0}
        <ul class="search-list" bind:this={listEl}>
            {#each filteredItems as item, index (item.originalIndex)}
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
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

    .input-wrapper {
        position: relative;
    }

    .search-input {
        width: 100%;
        padding: 0.5rem 1.5rem 0.5rem 0.5rem;
        box-sizing: border-box;
        font-weight: bold;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        outline: none;
    }

    .clear-btn {
        position: absolute;
        right: 0.3rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #aaa;
        padding: 0;
    }

    .clear-btn:hover {
        color: #fff;
    }

    .search-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 250px;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
        background: rgb(39, 39, 39);
        position: absolute;
        width: 100%;
        z-index: 10;
        font-size: 0.9em;
        text-align: left;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
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
