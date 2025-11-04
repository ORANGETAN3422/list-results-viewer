<script>
    import {
        getColor,
        formatKey,
        calculateStats,
    } from "../helpers/dataAnalyse";

    import LeaderboardCard from "./Cards/LeaderboardCard.svelte";
    import StatsCard from "./Cards/StatsCard.svelte";

    export let data;

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

        <h3>{formatKey(selectedItem.name)}</h3>

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

    <StatsCard
        title={"Individual Stats - " + formatKey(selectedItem.name)}
        stats={selectedItem.stats}
    />
    <LeaderboardCard {leaderboard} />
</section>
