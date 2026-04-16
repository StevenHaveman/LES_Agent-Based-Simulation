import OverviewService from '../services/OverviewService';

export function useOverview() {

    const getSimulationGraphicResults = async () => {
        try {
            const result = await OverviewService.getSimulationGraphicResults();
            console.log('Simulation overview fetched successfully');
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
        fetchSimulationConfig
    };
}
