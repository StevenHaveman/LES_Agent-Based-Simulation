import ConfigFormService  from "../service/ConfigFormService.js";

class ConfigFormController {
    constructor(service) {
        this.service = service;
    }

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

const configFormController = new ConfigFormController(ConfigFormService);
export default configFormController;