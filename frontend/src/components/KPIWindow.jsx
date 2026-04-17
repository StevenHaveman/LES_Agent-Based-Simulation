import React from 'react';
import '../styles/KPIWindow.css';
import { useOverview } from '../hooks/useOverview.js';
import { useSimulationRun } from '../hooks/useSimulationRun.js';
import { countHouseholdsWithPackage, countHouseholdsWithBoth, averageHouseholdIncome } from '../utils/householdStats.js';

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
                set_house_hold_data(await useOverview().fetchHouseholds(undefined));
                set_sim_config(await useOverview().fetchSimulationConfig());
            } catch (error) {
                console.error('error fetching household data:', error);
            }

            set_loading(false);
        }

        async function start_fetch_loop() {
            const delayTime = 3;
            const delayMs = 1000;

            const result = await useSimulationRun().getSimulationDelay();
            const delay_in_ms = (parseInt(result?.delay) || delayTime) * delayMs;

            await fetch_data();

            interval_id = setInterval(fetch_data, delay_in_ms);
        }

        start_fetch_loop();

        return function () {
            if (interval_id)
            {clearInterval(interval_id);}
        };
    }, []);

    if (loading)
    {return <div><h3>Loading...</h3></div>;}

    const counted_solar_data_hh = countHouseholdsWithPackage(house_hold_data, 'Solar Panel_installed');
    const counted_heat_pump_data_hh = countHouseholdsWithPackage(house_hold_data, 'Heat Pump_installed');
    const counted_full_data_hh = countHouseholdsWithBoth(house_hold_data, 'Heat Pump_installed', 'Solar Panel_installed');
    const avg_income = averageHouseholdIncome(house_hold_data);

    const percentFactor = 100;

    return (
        <>
            <h3>Solar Panels: {Math.round((counted_solar_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Heat Pumps: {Math.round((counted_heat_pump_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Fully Converted: {Math.round((counted_full_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Average Income: {Math.round(avg_income)}€</h3>
            <h3>Subjective Norm ({sim_config.subj_norm_level}): {sim_config.subjective_norm}</h3>
        </>
    );
};

export default KPIWindow;
