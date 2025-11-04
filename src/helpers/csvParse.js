export function filterCsv(csvText) {
    const rows = csvText.trim().split(/\r?\n/).map(line =>
        line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '')) || []
    );

    const headers = rows[0];
    const timestampIndex = headers.findIndex(h => h.trim().toLowerCase() === "timestamp");

    if (timestampIndex === -1) {
        console.error("No 'Timestamp' column found.");
        return "";
    }

    const keepIndexes = headers
        .map((h, i) => {
            const name = h.trim().toLowerCase();
            if (name.startsWith("rate ") || name === "who are you?") return i;
            return -1;
        })
        .filter(i => i !== -1);

    const filteredHeaders = ["Timestamp", ...keepIndexes.map(i => headers[i])];
    const timestampRegex = /^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}$/;

    const filteredRows = rows
        .slice(1)
        .filter(cols => timestampRegex.test(cols[timestampIndex]?.trim()))
        .map(cols => {
            const timestamp = cols[timestampIndex];
            const kept = keepIndexes.map(i => cols[i]);
            return [timestamp, ...kept].join(",");
        });

    return [filteredHeaders.join(","), ...filteredRows].join("\n");
}

export function csvToJson(csvText) {
    const rows = csvText.trim().split(/\r?\n/);
    const headers = rows[0].split(",");

    const json = rows.slice(1).map(row => {
        const values = row.split(",");
        const obj = {};

        headers.forEach((header, i) => {
            const h = header.toLowerCase();
            const v = (values[i] ?? "").toLowerCase();
            if (h.startsWith("rate ")) obj[h.substring(5).trim().split(' ').join('_')] = parseInt(v, 10) ?? null;
            else if (h === "who are you?") obj["who"] = v ?? null;
        });
        return obj;
    });

    return json;
}