import React from "react";

import overview_controller from "../../controller/OverviewController.js";

import "../styles/KPIWindow.css";
import simulationRunController from "../../controller/SimulationRunController.js";

const KPIWindow = () => {
    /** @type {[Array<{
     "Heat Pump_installed": boolean,
     "Solar Panel_installed": boolean,
     "id": number,
     "name": string,
     "residents": {
     "Heat Pump_decision": boolean,
     "Solar Panel_decision": boolean,
     "income": number,
     "name": string
     }[]
     }>, Function]} */
    const [house_hold_data, set_house_hold_data] = React.useState([]);
    /**
     * @type {[{
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
     * }}, Function]
     */
    const [sim_config, set_sim_config] = React.useState([]);
    const [loading, set_loading] = React.useState(true);

    React.useEffect(function () {
        let interval_id;

        async function fetch_data() {
            try {
                set_house_hold_data(await overview_controller.fetch_households(undefined));
                set_sim_config(await overview_controller.fetchSimulationConfig());
            } catch (error) {
                console.error("error fetching household data:", error);
            }

            set_loading(false);
        }

        async function start_fetch_loop() {
            /** @type {{ delay: number }} */
            const result = await simulationRunController.getSimulationDelay();
            const delay_in_ms = (parseInt(result?.delay) || 3) * 1000;

            await fetch_data();

            interval_id = setInterval(fetch_data, delay_in_ms);
        }

        start_fetch_loop();

        return function () {
            if (interval_id)
                clearInterval(interval_id);
        };
    }, []);

    if (loading)
        return <div><h3>Loading...</h3></div>;

    const counted_solar_data_hh = house_hold_data.reduce((prev, cur) => cur["Solar Panel_installed"] ? prev + 1 : prev, 0);
    const counted_heat_pump_data_hh = house_hold_data.reduce((prev, cur) => cur["Heat Pump_installed"] ? prev + 1 : prev, 0);
    const counted_full_data_hh = house_hold_data.reduce((prev, cur) => cur["Heat Pump_installed"] && cur["Solar Panel_installed"] ? prev + 1 : prev, 0);
    const counted_income_total_hh = house_hold_data.reduce((prev, cur) => prev + (cur.residents.reduce((p, c) => p + c.income, 0) / cur.residents.length), 0);

    return (
        <>
            <h3>Solar Panels: {Math.round((counted_solar_data_hh / house_hold_data.length) * 100)}%</h3>
            <h3>Heat Pumps: {Math.round((counted_heat_pump_data_hh / house_hold_data.length) * 100)}%</h3>
            <h3>Fully Converted: {Math.round((counted_full_data_hh / house_hold_data.length) * 100)}%</h3>
            <h3>Average Income: {Math.round((counted_income_total_hh / house_hold_data.length))}€</h3>
            <h3>Subjective Norm ({sim_config.subj_norm_level}): {sim_config.subjective_norm}</h3>
        </>
    )
};

export default KPIWindow;