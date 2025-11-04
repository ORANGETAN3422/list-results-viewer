<script>
    import {
        getColor,
        formatKey,
        calculateStats,
    } from "../helpers/dataAnalyse";

    export let data;

    export let min = 1;
    export let max = 10;

    let items = Object.keys(data);
    let selectedIndex = 0;

    let sortOrder = "desc"; // "desc" | "asc" | "none"

    function toggleSortOrder() {
        if (sortOrder === "desc") sortOrder = "asc";
        else if (sortOrder === "asc") sortOrder = "none";
        else sortOrder = "desc";
    }

    // Derived data
    $: allStats = items.map((item) => ({
        name: item,
        ratings: data[item],
        stats: calculateStats(data[item]),
    }));

    $: selectedItem = allStats[selectedIndex] || {
        name: "",
        ratings: {},
        stats: {},
    };

    $: originalRatings = Object.entries(selectedItem.ratings);

    $: sortedRatings =
        sortOrder === "none"
            ? originalRatings
            : [...originalRatings].sort((a, b) =>
                  sortOrder === "desc" ? b[1] - a[1] : a[1] - b[1],
              );

    $: leaderboard =
        allStats.length > 0
            ? {
                  highestMean: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.average > prev.stats.average ? curr : prev,
                      allStats[0],
                  ),
                  lowestMean: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.average < prev.stats.average ? curr : prev,
                      allStats[0],
                  ),
                  highestMedian: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.median > prev.stats.median ? curr : prev,
                      allStats[0],
                  ),
                  lowestMedian: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.median < prev.stats.median ? curr : prev,
                      allStats[0],
                  ),
                  highestMode: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.modeCount > prev.stats.modeCount
                              ? curr
                              : prev,
                      allStats[0],
                  ),
                  lowestMode: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.modeCount < prev.stats.modeCount
                              ? curr
                              : prev,
                      allStats[0],
                  ),
                  highestStd: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.stdDev > prev.stats.stdDev ? curr : prev,
                      allStats[0],
                  ),
                  lowestStd: allStats.reduce(
                      (prev, curr) =>
                          curr.stats.stdDev < prev.stats.stdDev ? curr : prev,
                      allStats[0],
                  ),
              }
            : {
                  highestMean: { name: "", stats: {} },
                  lowestMean: { name: "", stats: {} },
                  highestMedian: { name: "", stats: {} },
                  lowestMedian: { name: "", stats: {} },
                  highestMode: { name: "", stats: {} },
                  lowestMode: { name: "", stats: {} },
                  highestStd: { name: "", stats: {} },
                  lowestStd: { name: "", stats: {} },
              };
</script>

<section class="user-section">
    <!-- Selected Item Panel -->
    <div class="card">
        <select bind:value={selectedIndex}>
            {#each allStats as { name }, index}
                <option value={index}>{name}</option>
            {/each}
        </select>

        <h3>{selectedItem.name}</h3>

        <!-- Sort Button -->
        <button on:click={toggleSortOrder} class="sort-btn">
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

    <!-- Individual Stats Panel -->
    <div class="card">
        <h3>Individual Stats - {selectedItem.name}</h3>
        {#each Object.entries(selectedItem.stats) as [statName, value]}
            <div class="rating-row">
                <span class="level-name">{formatKey(statName)}</span>
                <span class="level-value-green">
                    {statName === "mode"
                        ? `${value} (x${selectedItem.stats.modeCount})`
                        : value}
                </span>
            </div>
        {/each}
    </div>

    <!-- Leaderboard Panel -->
    <div class="card">
        <h3>Leaderboard</h3>
        <div class="rating-row">
            <span class="level-name">Highest Mean 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestMean.name} ({leaderboard.highestMean.stats
                    .average})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Mean 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMean.name} ({leaderboard.lowestMean.stats
                    .average})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Median 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestMedian.name} ({leaderboard.highestMedian
                    .stats.median})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Median 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMedian.name} ({leaderboard.lowestMedian
                    .stats.median})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Mode 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestMode.name} ({leaderboard.highestMode.stats
                    .mode} x{leaderboard.highestMode.stats.modeCount})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Mode 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMode.name} ({leaderboard.lowestMode.stats
                    .mode} x{leaderboard.lowestMode.stats.modeCount})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Std Dev 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestStd.name} ({leaderboard.highestStd.stats
                    .stdDev})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Std Dev 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestStd.name} ({leaderboard.lowestStd.stats
                    .stdDev})</span
            >
        </div>
    </div>
</section>
