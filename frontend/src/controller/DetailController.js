import DetailService from '../service/DetailService.js';

class DetailController {
    constructor(service) {
        /** @type {DetailService} */
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

    async fetchSimulationConfig() {
        return await this.service.fetchSimulationConfig();
    }

    async getDelay() {
        return await DetailService.getDelay();
    }
}

// Exporting an instance of DetailController with the service injected.
const detailController = new DetailController(DetailService);
export default detailController;