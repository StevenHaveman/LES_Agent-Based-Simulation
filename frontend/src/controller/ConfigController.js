/**
 * ConfigFormController Class
 *
 * This class acts as a controller for managing the simulation configuration process.
 * It interacts with the `ConfigFormService` to start the simulation based on the provided configuration.
 *
 * Constructor:
 * - Initializes the controller with a service instance.
 *
 * Methods:
 * - `startSimulation(config)`: Asynchronously starts the simulation by calling the service's `start_Simulation` method.
 *   - Parameters:
 *     - `config` (Object): The configuration object containing simulation parameters.
 *   - Returns:
 *     - The result of the simulation start process.
 *   - Throws:
 *     - An error if the simulation fails.
 */

import ConfigFormService from "../service/ConfigService.js";

class ConfigController {
    /**
     * Constructor for ConfigFormController.
     *
     * @param {Object} service - An instance of the service used to interact with the backend.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Starts the simulation with the provided configuration.
     *
     * @param {Object} config - The configuration object containing simulation parameters.
     * @returns {Promise<Object>} - The result of the simulation start process.
     * @throws {Error} - Throws an error if the simulation fails.
     */
    async startSimulation(config) {
        try {
            const result = await this.service.start_simulation(config);
            console.log("Simulation started successfully");
            return result;
        } catch (error) {
            console.error("Simulation Failed", error);
            throw error;
        }
    }
}

// Create an instance of ConfigFormController with the ConfigFormService.
const configFormController = new ConfigController(ConfigFormService);
export default configFormController;