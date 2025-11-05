<script>
    import { formatKey, calculateStats } from "../helpers/dataAnalyse";

    import LeaderboardCard from "./Cards/LeaderboardCard.svelte";
    import ResultsCard from "./Cards/ResultsCard.svelte";
    import IndividualStatsCard from "./Cards/IndividualStatsCard.svelte";
    import SortingCard from "./Cards/SortingCard.svelte";

    export let data;
    export let currentlyViewing;

    let items = Object.keys(data);
    let selectedIndex = 0;

    let sortOrder = "none";

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

    $: leaderboard =
        allStats.length > 0
            ? {
                  highestMean: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.average > prev.stats.average
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.average,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.average > prev.stats.average
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
                  lowestMean: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.average < prev.stats.average
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.average,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.average < prev.stats.average
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
                  highestMedian: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.median > prev.stats.median
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.median,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.median > prev.stats.median
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
                  lowestMedian: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.median < prev.stats.median
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.median,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.median < prev.stats.median
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
                  highestMode: (() => {
                      const best = allStats.reduce(
                          (prev, curr) =>
                              curr.stats.modeCount > prev.stats.modeCount
                                  ? curr
                                  : prev,
                          allStats[0],
                      );
                      return {
                          value: best.stats.mode,
                          modeCount: best.stats.modeCount,
                          recordHolder: best.name,
                      };
                  })(),

                  lowestMode: (() => {
                      const worst = allStats.reduce(
                          (prev, curr) =>
                              curr.stats.modeCount < prev.stats.modeCount
                                  ? curr
                                  : prev,
                          allStats[0],
                      );
                      return {
                          value: worst.stats.mode,
                          modeCount: worst.stats.modeCount,
                          recordHolder: worst.name,
                      };
                  })(),
                  highestStd: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.stdDev > prev.stats.stdDev
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.stdDev,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.stdDev > prev.stats.stdDev
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
                  lowestStd: {
                      value: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.stdDev < prev.stats.stdDev
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).stats.stdDev,
                      recordHolder: allStats.reduce(
                          (prev, curr) =>
                              curr.stats.stdDev < prev.stats.stdDev
                                  ? curr
                                  : prev,
                          allStats[0],
                      ).name,
                  },
              }
            : {};
</script>

<section class="user-section">
    <ResultsCard
        {selectedItem}
        {allStats}
        bind:selectedIndex
        {sortOrder}
        onSortToggle={toggleSortOrder}
    />

    <IndividualStatsCard
        title={"Individual Stats - " + formatKey(selectedItem.name)}
        stats={selectedItem.stats}
        {selectedItem}
    />

    <LeaderboardCard {leaderboard} {currentlyViewing} />

    <SortingCard {allStats} />
</section>
