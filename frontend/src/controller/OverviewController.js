/**
 * OverviewController Class
 *
 * This class acts as a controller for managing interactions with the `OverviewService`.
 * It provides methods to fetch household data, simulation graphic results, and simulation delay.
 *
 * Constructor:
 * - `OverviewController(service)`: Initializes the controller with the provided service instance.
 *   - Parameters:
 *     - `service` (Object): An instance of the service used for API calls.
 *
 * Methods:
 * - `fetch_households(config)`: Fetches household data using the service.
 *   - Parameters:
 *     - `config` (Object): Configuration object for fetching households (optional).
 *   - Returns:
 *     - A Promise resolving to the fetched household data.
 *   - Throws:
 *     - An error if the service call fails.
 *
 * - `getOverview()`: Fetches simulation graphic results using the service.
 *   - Returns:
 *     - A Promise resolving to the simulation graphic results.
 *   - Throws:
 *     - An error if the service call fails.
 *
 * - `getSimulationDelay()`: Retrieves the simulation delay using the service.
 *   - Returns:
 *     - A Promise resolving to the simulation delay value.
 *   - Throws:
 *     - An error if the service call fails.
 */

import OverviewService from "../service/OverviewService.js";

class OverviewController {


    constructor(service) {
        this.service = service;
    }

    async fetch_households(config) {
        try {
            const result = await this.service.fetchHouseholds(config);
            console.log("Households fetched successfully");
            return result;
        } catch (error) {
            console.error("Fetching households failed", error);
            throw error;
        }
    }

    async getSimulationGraphicResults() {
        try {
            const result = await this.service.getSimulationGraphicResults();
            console.log("Simulation overview fetched successfully");
            return result;
        } catch (error) {
            console.error("Simulation overview fetch failed:", error);
            throw error;
        }
    }

    async fetchSimulationConfig() {
        return await this.service.fetchSimulationConfig();
    }

}

const overviewController = new OverviewController(OverviewService);
export default overviewController;