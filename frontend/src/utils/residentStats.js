export function averageResidentScores(resident, keys) {
    const values = keys
        .map((key) => resident?.[key])
        .filter((value) => typeof value === 'number' && Number.isFinite(value));

    if (!values.length) {
        return 0;
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    return total / values.length;
}