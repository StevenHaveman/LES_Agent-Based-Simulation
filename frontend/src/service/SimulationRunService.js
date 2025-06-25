const API_URL = import.meta.env.VITE_API_URL_LOCAL;

/**
 * SimulationRunService class provides methods to interact with the backend API
 * for managing the simulation run, including pausing, setting delays, and retrieving statuses.
 */
class SimulationRunService {
    /**
     * Toggles the pause state of the simulation by sending a POST request to the backend.
     *
     * @returns {Promise<Object>} The response from the backend containing the updated pause state.
     * @throws {Error} If the request fails.
     */
    async togglePause() {
        const response = await fetch(`${API_URL}/toggle_pause`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }

    /**
     * Retrieves the current pause status of the simulation by sending a GET request to the backend.
     *
     * @returns {Promise<Object>} The response from the backend containing the pause status.
     * @throws {Error} If the request fails.
     */
    async getPauseStatus() {
        const response = await fetch(`${API_URL}/pause_status`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }

    /**
     * Sets the delay between simulation steps by sending a POST request to the backend.
     *
     * @param {number} seconds - The delay in seconds to set for the simulation.
     * @returns {Promise<Object>} The response from the backend confirming the delay update.
     * @throws {Error} If the request fails.
     */
    async setDelay(seconds) {
        const response = await fetch(`${API_URL}/set_delay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ delay: seconds })
        });
        return response.json();
    }

    /**
     * Retrieves the current delay between simulation steps by sending a GET request to the backend.
     *
     * @returns {Promise<Object>} The response from the backend containing the delay value.
     * @throws {Error} If the request fails.
     */
    async getDelay() {
        const response = await fetch(`${API_URL}/get_delay`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }

    /**
     * Fetches the simulation delay from the backend.
     *
     * @returns {Promise<Object>} The response from the backend containing the delay value.
     * @throws {Error} If the request fails or the response is not OK.
     */
    async getSimulationDelay() {
        const response = await fetch(`${API_URL}/get_delay`);

        if (!response.ok) {
            throw new Error("Fetching delay failed");
        }

        return await response.json();
    }
}

/**
 * Singleton instance of SimulationRunService for reuse across the application.
 */
const simulationRunService = new SimulationRunService();
export default simulationRunService;