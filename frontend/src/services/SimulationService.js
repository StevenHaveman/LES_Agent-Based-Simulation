const API_URL = 'http://127.0.0.1:5000';

class SimulationService {
    async startSimulation(params = {}) {
        const response = await fetch(`${API_URL}/simulation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        return response.json();
    }
}

const simulationService = new SimulationService();
export default simulationService;
