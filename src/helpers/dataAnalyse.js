export function getColor(value, min = 1, max = 10) {
    let ratio = (value - min) / (max - min);
    ratio = Math.min(Math.max(ratio, 0), 1);
    const r = Math.round(255 * (1 - ratio));
    const g = Math.round(255 * ratio);
    return `rgb(${r}, ${g}, 0)`;
}

export function formatKey(key) {
    return key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function calculateStats(ratings) {
    const values = Object.values(ratings).map(Number);
    const len = values.length;
    if (len === 0) {
        return {
            average: 0, highest: 0, lowest: 0,
            mode: 0, modeCount: 0, median: 0, stdDev: 0,
        };
    }

    const average = Math.round((values.reduce((a, b) => a + b, 0) / len) * 100) / 100;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    const sorted = values.slice().sort((a, b) => a - b);
    let mode = sorted[0], modeCount = 1, current = sorted[0], count = 1;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1]) count++;
        else {
            if (count > modeCount) { modeCount = count; mode = current; }
            current = sorted[i]; count = 1;
        }
    }
    if (count > modeCount) { modeCount = count; mode = current; }

    const mid = Math.floor(len / 2);
    const median = len % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const stdDev = Math.round(
        Math.sqrt(values.reduce((sum, v) => sum + (v - average) ** 2, 0) / len) * 1000
    ) / 1000;

    return { average, highest, lowest, mode, modeCount, median, stdDev };
}
