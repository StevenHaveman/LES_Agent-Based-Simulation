const API_URL = import.meta.env.VITE_API_URL;

/**
 * SimulationParametersService class provides methods to interact with the backend API
 * for fetching and updating simulation parameters.
 */
class SimulationParametersService {
    /**
     * Fetches the simulation parameters from the backend API.
     *
     * @returns {Promise<Object>} The configuration object containing simulation parameters.
     * @throws {Error} If the fetch operation fails.
     */
    async fetchParameters() {
        const response = await fetch(`${API_URL}/parameters`);
        if (!response.ok) {
            throw new Error("Failed to fetch config");
        }
        return await response.json();
    }

    /**
     * Updates a specific simulation parameter with a new value.
     *
     * @param {string} parameter - The name of the parameter to update.
     * @param {number} value - The new value to set for the parameter.
     * @returns {Promise<Object>} The result of the update operation from the backend.
     * @throws {Error} If the update operation fails.
     */
    async updateParameter(parameter, value) {
        const response = await fetch(`${API_URL}/update_parameter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ parameter, value }),
        });

        if (!response.ok) {
            throw new Error("Parameter update failed");
        }

        return await response.json();
    }
}

// Singleton instance of SimulationParametersService for reuse across the application.
const simulationParametersService = new SimulationParametersService();
export default simulationParametersService;