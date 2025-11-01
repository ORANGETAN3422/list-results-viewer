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
        const personObj = {};
        obj[result.who] = personObj;
        for (const key in result) {
            if (key === "who") continue;
            personObj[key] = result[key];
        }
    });
    return obj;
}