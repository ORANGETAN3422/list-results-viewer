<script>
    export let title;
    export let stats;
</script>

<div class="card">
    <h3>{title}</h3>
    {#each Object.entries(stats) as [statName, value]}
        <div class="rating-row">
            <span class="level-name">{statName}</span>
            <span class="level-value-green">
                {statName === "mode" ? `${value} (x${stats.modeCount})` : value}
            </span>
        </div>
    {/each}
</div>
