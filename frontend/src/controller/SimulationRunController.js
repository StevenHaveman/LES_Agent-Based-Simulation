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

    async setDelay(seconds) {
        return await this.service.setDelay(seconds);
    }
    async getDelay() {
        return await this.service.getDelay();
    }

    async getSimulationDelay() {
        try {
            const result = await this.service.getSimulationDelay();
            console.log("Simulation delay fetched successfully");
            return result;
        } catch (error) {
            console.error("Simulation delay fetch failed:", error);
            throw error;
        }
    }

}

const simulationRunController = new SimulationRunController(SimulationRunService);
export default simulationRunController;