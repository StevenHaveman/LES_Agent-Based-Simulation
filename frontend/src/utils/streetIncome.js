export const buildStreetIncomeMap = (houses) => {
    const map = {};

    houses.forEach(house => {
        const address = house.address || '';
        const street = address.split(/\s\d/)[0].trim();

        if (!street) {
            return;
        }

        if (!map[street]) {
            map[street] = {
                residents: [],
            };
        }

        if (Array.isArray(house.residents)) {
            map[street].residents.push(...house.residents);
        }
    });

    Object.keys(map).forEach(street => {
        const residents = map[street].residents;

        map[street].avgIncome =
            residents.length > 0
                ? (
                    residents.reduce(
                        (sum, resident) =>
                            sum + (resident.income || 0),
                        0
                    ) / residents.length
                ).toFixed(0)
                : null;
    });

    return map;
};
