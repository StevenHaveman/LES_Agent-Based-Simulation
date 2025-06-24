import SimulationParametersService from "../service/SimulationParametersService.js";


class SimulationParametersController {
    constructor(service) {
        this.service = service;
    }

    async fetchParameters() {
        const res = await this.service.fetchParameters();
        const config = res.config;

        const exclude = ["nr_households", "nr_residents", "simulation_years", "seed"];

        return Object.keys(config)
            .filter((key) => !exclude.includes(key))
            .map((key) => ({ key, value: config[key] }));
    }

    async updateParameter(key, value) {
        return await this.service.updateParameter(key, value);
    }
}

const simulationParametersController = new SimulationParametersController(SimulationParametersService);
export default simulationParametersController;