<script>
    import { formatKey } from "../../helpers/dataAnalyse";

    export let leaderboard = {};
    export let currentlyViewing = "";

    function capitalise(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const metrics = [
        { key: "mean", label: "Mean" },
        { key: "median", label: "Median" },
        { key: "mode", label: "Mode" },
        { key: "std", label: "Std Dev" },
    ];

    const stats =
        leaderboard && Object.keys(leaderboard).length > 0
            ? metrics.flatMap((metric) => {
                  const highKey = `highest${metric.key.charAt(0).toUpperCase() + metric.key.slice(1)}`;
                  const lowKey = `lowest${metric.key.charAt(0).toUpperCase() + metric.key.slice(1)}`;

                  const buildEntry = (label, keyName, isHigh) => {
                      return [
                          label + (isHigh ? " 🢁" : " 🢃"),
                          keyName,
                          metric.key,
                          isHigh,
                      ];
                  };

                  return [
                      buildEntry(`Highest ${metric.label}`, highKey, true),
                      buildEntry(`Lowest ${metric.label}`, lowKey, false),
                  ];
              })
            : [];
</script>

<div class="card">
    <h3>{capitalise(currentlyViewing)} Leaderboard</h3>

    {#each stats as [label, boardKey, key, positive]}
        <div class="rating-row">
            <span class="level-name">{label}</span>
            <span class={positive ? "level-value-green" : "level-value-red"}>
                {formatKey(leaderboard[boardKey]?.recordHolder) ?? "-"} - {#if key === "mode"}
                    {leaderboard[boardKey]?.value} x{leaderboard[boardKey]
                        ?.modeCount}
                {:else}
                    {leaderboard[boardKey]?.value}
                {/if}
            </span>
        </div>
        {#if label.includes("Median 🢃") || label.includes("Mode 🢃") || label.includes("Mean 🢃")}
            <hr />
        {/if}
    {/each}
</div>
