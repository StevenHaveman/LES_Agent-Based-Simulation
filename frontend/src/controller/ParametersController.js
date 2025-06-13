import ParametersService from "../service/ParametersService.js";

class ParametersController {
    constructor(service) {
        this.service = service;
    }

    async getDropdownOptions() {
        const res = await this.service.fetchAllParameters();
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

const parameterController = new ParametersController(ParametersService);
export default parameterController;