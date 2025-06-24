import SimulationParametersService from "../service/SimulationParametersService.js";

/**
 * SimulationParametersController class acts as a mediator between the SimulationParametersService
 * and the frontend components. It provides methods to fetch and update simulation parameters.
 */
class SimulationParametersController {
    /**
     * Creates an instance of SimulationParametersController.
     *
     * @param {SimulationParametersService} service - The service instance used to interact with the backend.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Fetches the simulation parameters from the backend service.
     * Filters out excluded parameters and returns the remaining ones as key-value pairs.
     *
     * @returns {Promise<Array<Object>>} A list of simulation parameters, each containing a key and value.
     * @throws {Error} If the fetch operation fails.
     */
    async fetchParameters() {
        const res = await this.service.fetchParameters();
        const config = res.config;

        // List of parameter keys to exclude from the results.
        const exclude = ["nr_households", "nr_residents", "simulation_years", "seed"];

        return Object.keys(config)
            .filter((key) => !exclude.includes(key))
            .map((key) => ({ key, value: config[key] }));
    }

    /**
     * Updates a specific simulation parameter with a new value.
     *
     * @param {string} key - The key of the parameter to update.
     * @param {number} value - The new value to set for the parameter.
     * @returns {Promise<Object>} The result of the update operation from the backend.
     * @throws {Error} If the update operation fails.
     */
    async updateParameter(key, value) {
        return await this.service.updateParameter(key, value);
    }
}

// Singleton instance of SimulationParametersController for reuse across the application.
const simulationParametersController = new SimulationParametersController(SimulationParametersService);
export default simulationParametersController;