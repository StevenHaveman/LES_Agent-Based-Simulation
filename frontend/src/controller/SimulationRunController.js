import SimulationRunService from "../service/SimulationRunService.js";

/**
 * SimulationRunController class acts as a mediator between the SimulationRunService
 * and the frontend components. It provides methods to manage the simulation run,
 * including sending prompts, toggling pause state, setting delays, and retrieving statuses.
 */
class SimulationRunController {
    /**
     * Creates an instance of SimulationRunController.
     *
     * @param {SimulationRunService} service - The service instance used to interact with the backend.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Sends a prompt to the backend service.
     *
     * @param {string} prompt - The prompt to send.
     * @returns {Promise<Object>} The response from the backend.
     * @throws {Error} If the operation fails.
     */
    async sendPrompt(prompt) {
        return await this.service.sendPrompt(prompt);
    }

    /**
     * Toggles the pause state of the simulation by interacting with the backend service.
     *
     * @returns {Promise<Object>} The response from the backend containing the updated pause state.
     * @throws {Error} If the operation fails.
     */
    async togglePause() {
        return await this.service.togglePause();
    }

    /**
     * Retrieves the current pause status of the simulation from the backend service.
     *
     * @returns {Promise<Object>} The response from the backend containing the pause status.
     * @throws {Error} If the operation fails.
     */
    async getPauseStatus() {
        return await this.service.getPauseStatus();
    }

    /**
     * Sets the delay between simulation steps by interacting with the backend service.
     *
     * @param {number} seconds - The delay in seconds to set for the simulation.
     * @returns {Promise<Object>} The response from the backend confirming the delay update.
     * @throws {Error} If the operation fails.
     */
    async setDelay(seconds) {
        return await this.service.setDelay(seconds);
    }

    /**
     * Retrieves the current delay between simulation steps from the backend service.
     *
     * @returns {Promise<Object>} The response from the backend containing the delay value.
     * @throws {Error} If the operation fails.
     */
    async getDelay() {
        return await this.service.getDelay();
    }

    /**
     * Fetches the simulation delay from the backend service.
     * Logs success or error messages to the console.
     *
     * @returns {Promise<Object>} The response from the backend containing the delay value.
     * @throws {Error} If the operation fails or the response is not OK.
     */
    async getSimulationDelay() {
        try {
            const result = await this.service.getSimulationDelay();
            console.log("Simulation delay fetched successfully");
            return result;
        } catch (error) {
            console.error("Simulation delay fetch failed:", error);
            throw error;
        }
    }
}

/**
 * Singleton instance of SimulationRunController for reuse across the application.
 */
const simulationRunController = new SimulationRunController(SimulationRunService);
export default simulationRunController;