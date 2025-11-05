export function sortIntoLevels(results) {
    const obj = {};
    results.forEach(result => {
        const user = result.who;
        for (const key in result) {
            if (key === "who") continue;
            if (!obj[key]) {
                obj[key] = {};
            }
            obj[key][user] = result[key];
        }
    });
    return obj;
}

export function sortIntoPeople(results) {
    const obj = {};

    results.forEach(result => {
        const user = result.who;
        if (!obj[user]) {
            obj[user] = {};
        }

        for (const key in result) {
            if (key === "who") continue;

            const newValue = result[key];
            const existingValue = obj[user][key];

            if (
                newValue !== null &&
                newValue !== "" &&
                newValue !== undefined
            ) {
                obj[user][key] = newValue;
            } else if (existingValue === undefined) {
                obj[user][key] = newValue;
            }
        }
    });

    return obj;
}
