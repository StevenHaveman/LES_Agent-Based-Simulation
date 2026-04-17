import SimulationRunService from '../services/SimulationRunService';

export function useSimulationRun() {

    const sendPrompt = async (prompt) => {
        return await SimulationRunService.sendPrompt(prompt);
    };

    const togglePause = async () => {
        return await SimulationRunService.togglePause();
    };

    const getPauseStatus = async () => {
        return await SimulationRunService.getPauseStatus();
    };

    const setDelay = async (seconds) => {
        return await SimulationRunService.setDelay(seconds);
    };

    const getDelay = async () => {
        return await SimulationRunService.getDelay();
    };

    const getSimulationDelay = async () => {
        try {
            const result = await SimulationRunService.getSimulationDelay();
            return result;
        } catch (error) {
            console.error('Simulation delay fetch failed:', error);
            throw error;
        }
    };

    return {
        sendPrompt,
        togglePause,
        getPauseStatus,
        setDelay,
        getDelay,
        getSimulationDelay
    };
}
