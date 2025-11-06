import { calculateStats, formatKey } from "./dataAnalyse";

export function exportResults(levels, people) {
    const levelNames = Object.keys(people);
    let outputString = "";

    let levelStats = levelNames.map((item) => ({
        stats: calculateStats(people[item]),
    }));

    for (let i = 0; i < levelNames.length; i++) {
        const l = levelNames[i];
        const average = levelStats[i].stats.average;

        let o = `${formatKey(l)}: ${average}`
        outputString += o + "\n";
    }

    navigator.clipboard.writeText(outputString);
    alert("Copied!");
}