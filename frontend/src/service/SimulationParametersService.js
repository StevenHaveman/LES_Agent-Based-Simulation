const API_URL = "http://127.0.0.1:5000";

class SimulationParametersService {
    async fetchParameters() {
        const response = await fetch(`${API_URL}/parameters`);
        if (!response.ok) {
            throw new Error("Failed to fetch config");
        }
        return await response.json();
    }

    async updateParameter(parameter, value) {
        const response = await fetch(`${API_URL}/update_parameter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({parameter, value}),
        });

        if (!response.ok) {
            throw new Error("Parameter update failed");
        }

        return await response.json();
    }
}

const simulationParametersService = new SimulationParametersService();
export default simulationParametersService;