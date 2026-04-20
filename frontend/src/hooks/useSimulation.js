import { startSimulation } from '../services/configService.js';

export function useSimulation() {
    const start = async (config) => {
        try {
            const result = await startSimulation(config);
            return result;
        } catch (error) {
            console.error('Simulation Failed', error);
            throw error;
        }
    };

    return { start };
}
