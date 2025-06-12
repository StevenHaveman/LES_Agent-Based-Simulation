const API_URL = "http://127.0.0.1:5000";

class DetailService{

    async fetchHouseholds() {
        const response = await fetch(`${API_URL}/fetch_households`);
        if (!response.ok) {
            throw new Error("Fetching households failed");
        }
        return await response.json();
    }

    /**
     * @returns {Promise<{
     *   CO2_electricity: number,
     *   CO2_gas: number,
     *   attitude: number | null,
     *   attitude_mod: number | null,
     *   behavioral_mod: number | null,
     *   decision_threshold: number,
     *   energy_generation_range: number[],
     *   energy_price: number,
     *   gas_price: number,
     *   heat_pump_price: number,
     *   heatpump_price_increase: number[],
     *   household_decision_threshold: number,
     *   initial_heatpump_chance: number,
     *   initial_solarpanel_chance: number,
     *   max_nr_houses: number,
     *   median_income: number,
     *   min_nr_houses: number,
     *   nr_households: number,
     *   nr_residents: number,
     *   raise_income: number[],
     *   seed: number,
     *   sigma_normal: number,
     *   simulation_years: number,
     *   solar_panel_amount_options: number[],
     *   solar_panel_price: number,
     *   solarpanel_price_increase: number[],
     *   subj_norm_level: string,
     *   subj_norm_mod: number | null,
     *   subjective_norm: number,
     *   yearly_energy_usage: number[],
     *   yearly_gas_usage: number[],
     *   yearly_heatpump_usage: number[]
     * }>}
     */
    async fetchSimulationConfig() {
        const response = await fetch(`${API_URL}/config`, { method: "GET" });
        if (!response.ok) {
            throw new Error("Fetching sim config failed");
        }
        return await response.json();
    }

}
// Exporting an instance of DetailService.
const detailService = new DetailService();
export default detailService;