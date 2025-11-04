export function filterCsv(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell);
            currentCell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') continue;
            currentRow.push(currentCell);
            if (currentRow.some(cell => cell.trim() !== '')) rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }

    if (currentCell || currentRow.length) currentRow.push(currentCell);
    if (currentRow.length && currentRow.some(cell => cell.trim() !== '')) rows.push(currentRow);

    const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
    const timestampIndex = headers.findIndex(h => h.toLowerCase() === 'timestamp');
    const whoAreYouIndex = headers.findIndex(h => h.toLowerCase() === 'who are you?');

    if (timestampIndex === -1 || whoAreYouIndex === -1) {
        console.error("❌ Required columns 'Timestamp' or 'Who are you?' not found.");
        return '';
    }

    const keepIndexes = [];
    for (let i = timestampIndex; i <= whoAreYouIndex; i++) keepIndexes.push(i);
    const filteredHeaders = keepIndexes.map(i => headers[i]);

    const filteredRows = [];
    for (const row of rows.slice(1)) {
        let ts = row[timestampIndex]?.trim().replace(/^"|"$/g, '');
        if (ts) {
            const parts = ts.split(' ');
            const dateParts = parts[0].split('/');
            if (dateParts.length === 3) {
                ts = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]} ${parts[1]}`;
            }
            const cleanedRow = [...row];
            cleanedRow[timestampIndex] = ts;
            const finalRow = keepIndexes.map(i => (cleanedRow[i] ?? '').trim().replace(/^"|"$/g, ''));
            filteredRows.push(finalRow.join(','));
        }
    }

    return [filteredHeaders.join(','), ...filteredRows].join('\n');
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