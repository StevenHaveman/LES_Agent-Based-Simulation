import SimulationRunService from "../service/SimulationRunService.js";

class SimulationRunController {
    constructor(service) {
        this.service = service;
    }

    async sendPrompt(prompt) {
        return await this.service.sendPrompt(prompt);
    }

    async togglePause() {
        return await this.service.togglePause();
    }

    async getPauseStatus() {
        return await this.service.getPauseStatus();
    }
}

const simulationRunController = new SimulationRunController(SimulationRunService);
export default simulationRunController;