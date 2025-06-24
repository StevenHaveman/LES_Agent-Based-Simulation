const API_URL = "http://127.0.0.1:5000";

class SimulationRunService {
    async togglePause() {
        const response = await fetch(`${API_URL}/toggle_pause`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
    async getPauseStatus() {
        const response = await fetch(`${API_URL}/pause_status`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }

    async setDelay(seconds) {
        const response = await fetch(`${API_URL}/set_delay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ delay: seconds })
        });
        return response.json();
    }

    async getDelay() {
        const response = await fetch(`${API_URL}/get_delay`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }


    async getSimulationDelay() {
        const response = await fetch(`${API_URL}/get_delay`);

        if (!response.ok) {
            throw new Error("Fetching delay failed");
        }

        return await response.json();
    }

}




const simulationRunService = new SimulationRunService();
export default simulationRunService;