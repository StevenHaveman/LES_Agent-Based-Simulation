import OverviewService from "../service/OverviewService.js";


class OverviewController {

    constructor(service) {
        this.service = service;
    }

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


const configFormController = new OverviewController(OverviewService);
export default configFormController;