import Papa from "papaparse";

export function csvToJson(csvText) {
    const { data, errors } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    });

    if (errors.length) {
        console.error(errors);
    }

    return data.map(row => {
        const obj = {};

        for (const [rawHeader, rawValue] of Object.entries(row)) {
            if (!rawHeader) continue;

            const header = rawHeader.toLowerCase().trim();
            const value = rawValue?.trim();

            if (header.startsWith("rate")) {
                let title = header
                    .replace(/^rate[: ]*/i, "")
                    .replace(/\s+by\s+.*$/i, "")
                    .trim();

                const key = title
                    .replace(/[^a-z0-9]+/g, "_")
                    .replace(/^_|_$/g, "");

                obj[key] = value ? Number(value) : null;
            }

            else if (header.includes("who are you")) {
                obj.who = value || null;
            }
        }

        return obj;
    });
}