/**
 * Controller for managing the configuration form logic.
 * It acts as a bridge between the view and the service layer.
 */
import ConfigFormService from "../service/ConfigFormService.js";

class ConfigFormController {
    /**
     * Initializes the ConfigFormController with a service instance.
     * @param {Object} service - The service instance to handle API calls.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Starts the simulation with the provided configuration.
     * @param {Object} config - The configuration object containing simulation parameters.
     * @returns {Promise<Object>} - The result of the simulation.
     * @throws {Error} - Throws an error if the simulation fails.
     */
    async startSimulation(config) {
        try {
            const result = await this.service.startSimulation(config);
            console.log("Simulation started successfully");
            return result;
        } catch (error) {
            console.error("Simulation Failed", error);
            throw error;
        }
    }

    /**
     * Fetches the overview of the simulation results.
     * @returns {Promise<Object>} - The graphical results of the simulation.
     * @throws {Error} - Throws an error if fetching the overview fails.
     */
    async getOverview() {
        try {
            const result = await this.service.getSimulationGraphicResults();
            console.log("Simulation overview fetched successfully");
            return result;
        } catch (error) {
            console.error("Simulation overview fetch failed:", error);
            throw error;
        }
    }
}

// Exporting an instance of ConfigFormController with the service injected.
const configFormController = new ConfigFormController(ConfigFormService);
export default configFormController;