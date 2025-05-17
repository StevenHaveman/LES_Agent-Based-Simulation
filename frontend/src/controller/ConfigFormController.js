
import ConfigFormService from "../service/ConfigFormService.js";

class ConfigFormController {

    constructor(service) {
        this.service = service;
    }

    async startSimulation(config) {
        try {
            const result = await this.service.start_Simulation(config);
            console.log("Simulation started successfully");
            return result;
        } catch (error) {
            console.error("Simulation Failed", error);
            throw error;
        }
    }

}

const configFormController = new ConfigFormController(ConfigFormService);
export default configFormController;