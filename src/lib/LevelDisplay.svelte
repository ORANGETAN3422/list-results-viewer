<script>
    export let sortedByLevels;

    let levels = Object.keys(sortedByLevels);
    let selectedIndex = 0;

    export let min = 1;
    export let max = 10;

    let sortOrder = "desc";

    function toggleSortOrder() {
        if (sortOrder === "desc") sortOrder = "asc";
        else if (sortOrder === "asc") sortOrder = "none";
        else sortOrder = "desc";
    }

    function getColor(value) {
        let ratio = (value - min) / (max - min);
        ratio = Math.min(Math.max(ratio, 0), 1);

        const r = Math.round(255 * (1 - ratio));
        const g = Math.round(255 * ratio);
        const b = 0;

        return `rgb(${r}, ${g}, ${b})`;
    }

    function formatKey(key) {
        return key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    function calculateStats(ratings) {
        const values = Object.values(ratings).map(Number);
        const len = values.length;

        if (len === 0) {
            return {
                average: 0,
                highest: 0,
                lowest: 0,
                mode: 0,
                modeCount: 0,
                median: 0,
                stdDev: 0,
            };
        }

        const average =
            Math.round(
                (values.reduce((sum, val) => sum + val, 0) / len) * 100,
            ) / 100;
        const highest = Math.max(...values);
        const lowest = Math.min(...values);

        // Mode
        let mode = values[0];
        let modeCount = 1;
        let current = values[0];
        let currentCount = 1;
        const sortedValues = values.slice().sort((a, b) => a - b);
        for (let i = 1; i < sortedValues.length; i++) {
            if (sortedValues[i] === sortedValues[i - 1]) {
                currentCount++;
            } else {
                if (currentCount > modeCount) {
                    modeCount = currentCount;
                    mode = current;
                }
                current = sortedValues[i];
                currentCount = 1;
            }
        }
        if (currentCount > modeCount) {
            modeCount = currentCount;
            mode = current;
        }

        // Median
        const mid = Math.floor(len / 2);
        const median =
            len % 2 === 0
                ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
                : sortedValues[mid];

        // Standard Deviation
        const stdDev =
            Math.round(
                Math.sqrt(
                    values.reduce((sum, val) => sum + (val - average) ** 2, 0) /
                        len,
                ) * 1000,
            ) / 1000;

        return { average, highest, lowest, mode, modeCount, median, stdDev };
    }

    $: allUserStats = levels.map((user) => ({
        user,
        ratings: sortedByLevels[user],
        stats: calculateStats(sortedByLevels[user]),
    }));

    $: selectedUserObj = allUserStats[selectedIndex] || {
        user: "",
        ratings: {},
        stats: {},
    };

    $: originalRatings = Object.entries(selectedUserObj.ratings);
    $: sortedRatings =
        sortOrder === "none"
            ? originalRatings
            : [...originalRatings].sort((a, b) =>
                  sortOrder === "desc" ? b[1] - a[1] : a[1] - b[1],
              );

    $: leaderboard = {
        highestMean: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.average > prev.stats.average ? curr : prev,
            allUserStats[0],
        ),
        lowestMean: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.average < prev.stats.average ? curr : prev,
            allUserStats[0],
        ),
        highestMedian: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.median > prev.stats.median ? curr : prev,
            allUserStats[0],
        ),
        lowestMedian: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.median < prev.stats.median ? curr : prev,
            allUserStats[0],
        ),
        highestMode: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.modeCount > prev.stats.modeCount ? curr : prev,
            allUserStats[0],
        ),
        lowestMode: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.modeCount < prev.stats.modeCount ? curr : prev,
            allUserStats[0],
        ),
        highestStd: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.stdDev > prev.stats.stdDev ? curr : prev,
            allUserStats[0],
        ),
        lowestStd: allUserStats.reduce(
            (prev, curr) =>
                curr.stats.stdDev < prev.stats.stdDev ? curr : prev,
            allUserStats[0],
        ),
    };
</script>

<section class="user-section">
    <!-- Selected User Panel -->
    <div class="card">
        <select bind:value={selectedIndex}>
            {#each allUserStats as { user }, index}
                <option value={index}>{user}</option>
            {/each}
        </select>

        <h3>{selectedUserObj.user}</h3>

        {#if Object.keys(selectedUserObj.ratings).length > 0}
            <!-- Sort Button -->
            <button on:click={toggleSortOrder} class="sort-btn">
                Sort:
                {#if sortOrder === "desc"}
                    Highest {">"} Lowest
                {:else if sortOrder === "asc"}
                    Lowest {">"} Highest
                {:else}
                    Default
                {/if}
            </button>

            {#each sortedRatings as [levelName, value]}
                <div class="rating-row">
                    <span class="level-name">{formatKey(levelName)}</span>
                    <span class="level-value" style="color: {getColor(value)}"
                        >{value}</span
                    >
                </div>
            {/each}
        {:else}
            <p>No ratings found for this user.</p>
        {/if}
    </div>

    <!-- Individual Stats Panel -->
    <div class="card">
        <h3>Individual Stats - {selectedUserObj.user}</h3>
        {#each Object.entries(selectedUserObj.stats) as [statName, value]}
            <div class="rating-row">
                <span class="level-name">{formatKey(statName)}</span>
                <span class="level-value-green">
                    {statName === "mode"
                        ? `${value} (x${selectedUserObj.stats.modeCount})`
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
                >{leaderboard.highestMean.user} ({leaderboard.highestMean.stats
                    .average})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Mean 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMean.user} ({leaderboard.lowestMean.stats
                    .average})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Median 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestMedian.user} ({leaderboard.highestMedian
                    .stats.median})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Median 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMedian.user} ({leaderboard.lowestMedian
                    .stats.median})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Mode 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestMode.user} ({leaderboard.highestMode.stats
                    .mode} x{leaderboard.highestMode.stats.modeCount})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Mode 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestMode.user} ({leaderboard.lowestMode.stats
                    .mode} x{leaderboard.lowestMode.stats.modeCount})</span
            >
        </div>
        <hr />
        <div class="rating-row">
            <span class="level-name">Highest Std Dev 🢁</span>
            <span class="level-value-green"
                >{leaderboard.highestStd.user} ({leaderboard.highestStd.stats
                    .stdDev})</span
            >
        </div>
        <div class="rating-row">
            <span class="level-name">Lowest Std Dev 🢃</span>
            <span class="level-value-red"
                >{leaderboard.lowestStd.user} ({leaderboard.lowestStd.stats
                    .stdDev})</span
            >
        </div>
    </div>
</section>

<style>
    .user-section {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
    }

    .card {
        width: 300px;
        max-height: 400px;
        border: 1px solid #ccc;
        border-radius: 12px;
        padding: 1rem;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: #ffffff00;
        resize: horizontal;
    }

    .rating-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .level-name {
        text-align: left;
    }

    .level-value {
        text-align: right;
        font-weight: bold;
    }

    .level-value-green {
        text-align: right;
        color: rgb(0, 255, 0);
        font-weight: bold;
    }

    .level-value-red {
        text-align: right;
        color: rgb(255, 0, 0);
        font-weight: bold;
    }

    select {
        margin-bottom: 1rem;
        width: 100%;
        padding: 0.3rem;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    .sort-btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        transition: background 0.3s ease;
    }
    .sort-btn:hover {
        background: #0056b3;
    }
</style>
