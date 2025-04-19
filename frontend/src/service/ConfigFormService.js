const API_URL = "http://127.0.0.1:5000";
class ConfigFormService {


    async startSimulation(config) {
        const response = await fetch(`${API_URL}/simulation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error("Simulatie starten mislukt");
        }

        return await response.json();
    }
}

const configFormService = new ConfigFormService();
export default configFormService;