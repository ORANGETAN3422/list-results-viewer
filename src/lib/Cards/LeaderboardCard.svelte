<script>
    export let leaderboard = {};
    export let currentlyViewing = "";

    function capitalise(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const metrics = [
        { key: "mean", label: "Mean" },
        { key: "median", label: "Median" },
        { key: "mode", label: "Mode", extraStats: ["modeCount"] },
        { key: "std", label: "Std Dev" },
    ];

    const stats =
        leaderboard && Object.keys(leaderboard).length > 0
            ? metrics.flatMap((metric) => {
                  const high =
                      leaderboard[
                          `highest${metric.key.charAt(0).toUpperCase() + metric.key.slice(1)}`
                      ];
                  const low =
                      leaderboard[
                          `lowest${metric.key.charAt(0).toUpperCase() + metric.key.slice(1)}`
                      ];

                  const buildEntry = (label, record, isHigh) => {
                      const statObj = { [metric.key]: record?.value ?? 0 };
                      if (metric.extraStats) {
                          metric.extraStats.forEach((extra) => {
                              statObj[extra] = record?.[extra] ?? 0;
                          });
                      }

                      return [
                          label + (isHigh ? " 🢃" : " 🢁"),
                          { user: record?.recordHolder ?? "-", stats: statObj },
                          metric.key,
                          isHigh,
                      ];
                  };

                  return [
                      buildEntry(`Highest ${metric.label}`, high, true),
                      buildEntry(`Lowest ${metric.label}`, low, false),
                  ];
              })
            : [];
</script>

<div class="card">
    <h3>{capitalise(currentlyViewing)} Leaderboard</h3>

    {#each stats as [label, entry, key, positive]}
        <div class="rating-row">
            <span class="level-name">{label}</span>
            <span class={positive ? "level-value-green" : "level-value-red"}>
                {entry.user} -
                {#if key === "mode"}
                    {entry.stats[key]} x{entry.stats.modeCount}
                {:else}
                    {entry.stats[key]}
                {/if}
            </span>
        </div>
        {#if label.includes("Median 🢃") || label.includes("Mode 🢃") || label.includes("Mean 🢃")}
            <hr />
        {/if}
    {/each}
</div>
