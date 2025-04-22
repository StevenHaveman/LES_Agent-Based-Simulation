import ConfigFormService  from "../service/ConfigFormService.js";

class ConfigFormController {
    constructor(service) {
        this.service = service;
    }

    async startSimulation(config) {
        try {
            const result = await this.service.startSimulation(config);
            console.log("Simulatie gelukt met deze waardes:");
            console.table(config);
            return result;
        } catch (error) {
            console.error("Simulatie mislukt:", error);
            throw error;
        }
    }

    async getSimulationGraphicResults() {
        try {
            const result = await this.service.getSimulationGraphicResults();
            console.log("Simulatie grafieken gelukt");
            return result;
        } catch (error) {
            console.error("Simulatie grafieken ophalen mislukt:", error);
            throw error;
        }
    }



}

const configFormController = new ConfigFormController(ConfigFormService);
export default configFormController;