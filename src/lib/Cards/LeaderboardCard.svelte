<script>
    export let leaderboard;

    const stats = [
        ["Highest Mean 🢁", leaderboard.highestMean, "average", true],
        ["Lowest Mean 🢃", leaderboard.lowestMean, "average", false],
        ["Highest Median 🢁", leaderboard.highestMedian, "median", true],
        ["Lowest Median 🢃", leaderboard.lowestMedian, "median", false],
        ["Highest Mode 🢁", leaderboard.highestMode, "mode", true],
        ["Lowest Mode 🢃", leaderboard.lowestMode, "mode", false],
        ["Highest Std Dev 🢁", leaderboard.highestStd, "stdDev", true],
        ["Lowest Std Dev 🢃", leaderboard.lowestStd, "stdDev", false],
    ];
</script>

<div class="card">
    <h3>Leaderboard</h3>

    {#each stats as [label, entry, key, positive]}
        <div class="rating-row">
            <span class="level-name">{label}</span>
            <span class={positive ? "level-value-green" : "level-value-red"}>
                {entry.user} ({entry.stats[key]}
                {key === "mode" ? ` x${entry.stats.modeCount}` : ""})
            </span>
        </div>
        {#if label.includes("Median 🢃") || label.includes("Mode 🢃")}
            <hr />
        {/if}
    {/each}
</div>
