export const KPI_RANK = { bad: 1, poor: 2, medium: 3, ok: 4, good: 5 };
export const RANK_KPI = { 1: 'Bad', 2: 'Poor', 3: 'Medium', 4: 'Ok', 5: 'Good' };

export function normalizeString(value) {
    if (value === undefined || value === null) return null;
    return String(value).trim().toLowerCase();
}

export function getHomeTrends(historicalData, home, startYearSimulation = 2024) {
    if (!historicalData || historicalData.length === 0 || !home) return null;

    const trends = { years: [], kpi_level: [], avg_income: [] };

    historicalData.forEach((yearData) => {
        if (!yearData.households || !Array.isArray(yearData.households)) return;

        let household = null;
        if (home.id !== undefined && home.id !== null) {
            const hid = String(home.id);
            household = yearData.households.find(hh => hh.id !== undefined && String(hh.id) === hid);
        }
        if (!household && home.address) {
            const targetAddr = normalizeString(home.address);
            household = yearData.households.find(hh => hh.address && normalizeString(hh.address) === targetAddr);
        }
        if (!household && home.address) {
            const targetAddr = normalizeString(home.address);
            household = yearData.households.find(hh => hh.address && normalizeString(hh.address).includes(targetAddr));
        }
        if (!household && Array.isArray(home.residents)) {
            const ids = home.residents.map(r => String(r.unique_id));
            household = yearData.households.find(hh => hh.residents && hh.residents.some(r => ids.includes(String(r.unique_id))));
        }
        if (!household) return;

        const computedYear = (Number(yearData.year) || 0) + startYearSimulation;
        trends.years.push(computedYear);

        let kpiLevel = null;
        if (Array.isArray(household.residents) && household.residents.length > 0) {
            const withKpi = household.residents.find(r => r.kpi_level !== undefined && r.kpi_level !== null);
            kpiLevel = withKpi ? withKpi.kpi_level : null;
        }
        trends.kpi_level.push(kpiLevel !== undefined ? kpiLevel : null);

        let avgIncome = null;
        if (Array.isArray(household.residents) && household.residents.length > 0) {
            const sum = household.residents.reduce((s, r) => s + (Number(r.income) || 0), 0);
            avgIncome = sum / household.residents.length;
        }
        trends.avg_income.push(avgIncome);
    });

    try {
        const currentKpi = home?.residents?.[0]?.kpi_level ?? null;
        if (currentKpi !== null && currentKpi !== undefined) {
            const lastKpi = trends.kpi_level[trends.kpi_level.length - 1];
            if (lastKpi === null || String(lastKpi) !== String(currentKpi)) {
                const nextYear = trends.years.length > 0 ? trends.years[trends.years.length - 1] + 1 : startYearSimulation;
                trends.years.push(nextYear);
                trends.kpi_level.push(currentKpi);
                const currentIncome = home?.residents && home.residents.length > 0 
                    ? (home.residents.reduce((s, r) => s + (Number(r.income) || 0), 0) / home.residents.length) 
                    : null;
                trends.avg_income.push(currentIncome);
            }
        }
    } catch (err) {
        console.error('Error adding current year:', err);
    }

    return trends.years.length > 0 ? trends : null;
}

export function getResidentTrends(historicalData, resident, startYearSimulation = 2024) {
    if (!historicalData || historicalData.length === 0 || !resident) return null;

    const trends = { years: [], perceived_norm: [], survey_pbc: [], attitude: [] };

    historicalData.forEach((yearData) => {
        if (!yearData.households || !Array.isArray(yearData.households)) return;

        const household = yearData.households.find((hh) =>
            hh.residents && hh.residents.some((r) => String(r.unique_id) === String(resident.unique_id))
        );
        if (!household) return;

        const residentData = household.residents.find((r) => String(r.unique_id) === String(resident.unique_id));
        if (!residentData) return;

        trends.years.push((Number(yearData.year) || 0) + startYearSimulation);
        trends.perceived_norm.push(residentData.perceived_norm || 0);
        trends.survey_pbc.push(residentData.survey_pbc || 0);
        trends.attitude.push(typeof residentData.attitude === 'number' ? residentData.attitude : 0);
    });

    return trends.years.length > 0 ? trends : null;
}
