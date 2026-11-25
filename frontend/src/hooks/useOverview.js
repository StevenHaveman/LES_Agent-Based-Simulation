import OverviewService from '../services/OverviewService';

export function useOverview() {

    const fetchKPIData = async () => {
        return await OverviewService.fetchKPIData();
    };

    const getSimulationGraphicResults = async () => {
        try {
            const result = await OverviewService.getSimulationGraphicResults();
            return result;
        } catch (error) {
            console.error('Simulation overview fetch failed:', error);
            throw error;
        }
    };

    const fetchHouseholds = async (config) => {
        return await OverviewService.fetchHouseholds(config);
    };

    const fetchSimulationConfig = async () => {
        return await OverviewService.fetchSimulationConfig();
    };

    return {
        getSimulationGraphicResults,
        fetchHouseholds,
        fetchSimulationConfig,
        fetchKPIData
    };
}
