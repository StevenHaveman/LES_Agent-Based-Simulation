export function countHouseholdsWithPackage(households, packageKey) {
    return households.reduce((prev, cur) => cur[packageKey] ? prev + 1 : prev, 0);
}

export function countHouseholdsWithBoth(households, key1, key2) {
    return households.reduce((prev, cur) => cur[key1] && cur[key2] ? prev + 1 : prev, 0);
}

export function averageHouseholdIncome(households) {
    if (!households.length) return 0;
    const total = households.reduce((prev, cur) => prev + (cur.residents.reduce((p, c) => p + c.income, 0) / cur.residents.length), 0);
    return total / households.length;
}
