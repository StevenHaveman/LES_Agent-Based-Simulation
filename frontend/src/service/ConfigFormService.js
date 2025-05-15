const API_URL = "http://127.0.0.1:5000";

class ConfigFormService {
    /**
     * Starts the simulation with the provided configuration.
     * @param {Object} config - The configuration object containing simulation parameters.
     * @param {number} config.nr_households - Number of households.
     * @param {number} config.nr_residents - Number of residents per household.
     * @param {number} config.simulation_years - Number of simulation years.
     * @returns {Promise<Object>} - The result of the simulation.
     * @throws {Error} - Throws an error if the API call fails.
     */
    async start_Simulation(config) {
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
}

// Exporting an instance of ConfigFormService.
const configFormService = new ConfigFormService();
export default configFormService;