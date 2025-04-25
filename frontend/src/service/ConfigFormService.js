const API_URL = "http://127.0.0.1:5000";

class ConfigFormService {

    async startSimulation(config) {
        const response = await fetch(`${API_URL}/config`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error("Starting simulation failed");
        }
        return await response.json();
    }


    async getSimulationGraphicResults() {
        const response = await fetch(`${API_URL}/overview`);

        if (!response.ok) {
            throw new Error("Fetching simulation graphic results failed");
        }

        return await response.json();
    }
}

const configFormService = new ConfigFormService();
export default configFormService;