import SimulationParametersService from '../services/SimulationParametersService';

export function useSimulationParameters() {

    const fetchParameters = async () => {
        const res = await SimulationParametersService.fetchParameters();
        const config = res.config;

        const exclude = ['nr_households', 'nr_residents', 'simulation_years', 'seed'];

        return Object.keys(config)
            .filter((key) => !exclude.includes(key))
            .map((key) => ({ key, value: config[key] }));
    };

    const updateParameter = async (key, value) => {
        return await SimulationParametersService.updateParameter(key, value);
    };

    return {
        fetchParameters,
        updateParameter
    };
}