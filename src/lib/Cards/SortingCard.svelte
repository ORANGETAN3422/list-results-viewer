<script>
    import { getColor, formatKey } from "../../helpers/dataAnalyse";

    export let allStats = [];
    let sortKey = "average";
    let sortOrder = "desc"; // "asc" or "desc"

    const sortKeys = ["average", "median", "mode", "stdDev"];

    function toggleSortOrder() {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    $: sortedStats = [...allStats].sort((a, b) => {
        if (!a.stats || !b.stats) return 0;

        let aVal, bVal;

        if (sortKey === "mode") {
            aVal = a.stats.modeCount ?? 0;
            bVal = b.stats.modeCount ?? 0;
        } else {
            aVal = a.stats[sortKey] ?? 0;
            bVal = b.stats[sortKey] ?? 0;
        }

        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
</script>

<div class="card">
    <h3>Sorting</h3>
    <div class="controls">
        <select bind:value={sortKey}>
            {#each sortKeys as key}
                <option value={key}
                    >{key.charAt(0).toUpperCase() + key.slice(1)}</option
                >
            {/each}
        </select>
        <button
            on:click={toggleSortOrder}
            class="sort-btn"
            class:desc={sortOrder === "desc"}
        >
            V
        </button>
    </div>

    <div class="user-list">
        {#if sortedStats.length > 0}
            {#each sortedStats as user}
                <div class="user-row">
                    <span class="user-name">{user.name}</span>
                    <span
                        class="user-value"
                        style="color: {getColor(
                            sortKey === 'mode'
                                ? (user.stats.mode ?? 0)
                                : (user.stats[sortKey] ?? 0),
                        )}"
                    >
                        {#if sortKey === "mode"}
                            {user.stats.mode ?? "-"}
                            {"("}x{user.stats.modeCount ?? 0}{")"}
                        {:else}
                            {user.stats[sortKey] ?? "-"}
                        {/if}
                    </span>
                </div>
            {/each}
        {:else}
            <p>No users found.</p>
        {/if}
    </div>
</div>

<style>
    .controls {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    }

    select {
        padding: 4px 8px;
        font-size: 14px;
    }

    .sort-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 14px;
        border-radius: 4px;
        margin-top: -1px;
        width: 32px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sort-btn.desc {
        transform: rotate(180deg);
    }

    .user-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .user-row {
        display: flex;
        justify-content: space-between;
    }

    .user-name {
        font-weight: bold;
    }

    .user-value {
        font-weight: bold;
    }
</style>
