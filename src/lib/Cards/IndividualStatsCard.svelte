<script>
    import { getColor } from "../../helpers/dataAnalyse";

    export let title;
    export let stats;
    export let selectedItem = { name: "", ratings: {}, stats: {} };

    $: ratingCounts = selectedItem?.ratings
        ? Object.values(selectedItem.ratings).reduce((acc, val) => {
              acc[val] = (acc[val] || 0) + 1;
              return acc;
          }, {})
        : {};

    $: modes = Object.entries(ratingCounts)
        .map(([value, count]) => ({ value: Number(value), count }))
        .sort((a, b) => b.value - a.value);
</script>

<div class="card">
    <h3>{title}</h3>

    {#if stats && Object.keys(stats).length > 0}
        {#each Object.entries(stats) as [statName, value]}
            <div class="rating-row">
                <span class="level-name">{statName}</span>
                <span
                    class="level-value-green"
                    style={"color: " + getColor(value)}
                >
                    {statName === "mode"
                        ? `${value} (x${stats.modeCount})`
                        : value}
                </span>
            </div>
        {/each}
    {:else}
        <p>No stats available.</p>
    {/if}

    <hr />

    {#if modes.length > 0}
        <div class="mode-summary">
            <h4>Mode Summary</h4>
            {#each modes as { value, count }}
                <div class="mode-row">
                    <span class="mode-value" style="color: {getColor(value)}">
                        <b>{value}</b>
                    </span>
                    <span>x<b>{count}</b></span>
                </div>
            {/each}
        </div>
    {:else}
        <p>No ratings available.</p>
    {/if}
</div>

<style>
    .card {
        padding: 1rem;
        border-radius: 8px;
        background: #1e1e1e;
        color: #fff;
        width: 300px;
    }
    .rating-row,
    .mode-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.3rem;
    }
    .level-value-green {
        font-weight: bold;
    }
</style>
