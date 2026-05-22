import React from 'react';
import '../styles/KPIWindow.css';
import { useOverview } from '../hooks/useOverview.js';
import { useSimulationRun } from '../hooks/useSimulationRun.js';
import { useSimulationYear } from '../hooks/useSimulationYear.js';

const KPIWindow = () => {
    // eslint-disable-next-line no-unused-vars
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

    // eslint-disable-next-line no-unused-vars
    const [sim_config, set_sim_config] = React.useState([]);
    const [kpi_data, set_kpi_data] = React.useState(null);
    const [loading, set_loading] = React.useState(true);
    const year = useSimulationYear();

    React.useEffect(function () {
        let interval_id;

        async function fetch_data() {
            try {
                set_house_hold_data(await useOverview().fetchHouseholds(undefined));
                set_sim_config(await useOverview().fetchSimulationConfig());
                set_kpi_data(await useOverview().fetchKPIData());
            } catch (error) {
                console.error('error fetching household or KPI data:', error);
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
            if (interval_id) {clearInterval(interval_id);}
        };
    }, []);

    if (loading) {
        return <div><h3>Loading...</h3></div>;
    }

    const thousandFactor = 1000;

    function formatT(num) {
        if (Math.abs(num) >= thousandFactor) {
            return (num / thousandFactor).toFixed(0) + 't';
        }
        return num.toString();
    }

    function formatK(num) {
        if (Math.abs(num) >= thousandFactor) {
            return (num / thousandFactor).toFixed(0) + 'k';
        }
        return num.toString();
    }

    const kpi = kpi_data || {};
    const simulationYearStart = 2024;
    return (
        <>
            {/* <h3>Solar Panels: {Math.round((counted_solar_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Heat Pumps: {Math.round((counted_heat_pump_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Fully Converted: {Math.round((counted_full_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Average Income: {Math.round(avg_income)}€</h3>
            <h3>Subjective Norm ({sim_config.subj_norm_level}): {sim_config.subjective_norm}</h3> */}
            <h3>KPI&apos;s</h3>
            <div>Emissions in 2025: {formatT(Number(kpi.co2_emissions_start_simulation?.toFixed(0)))} CO₂</div>
            <div>Emissions in{year !== null ? ` ${year + simulationYearStart}` : ''}: {formatT(Number(kpi.current_co2_emissions?.toFixed(0)))} CO₂</div>
            <div>Total CO2 Reduced: {formatT(Number(kpi.total_co2_reduced?.toFixed(0)))} CO₂</div>
            <div>Total CO2 Emitted: {formatT(Number(kpi.total_co2_emitted_during_simulation?.toFixed(0)))} CO₂</div>
            <div>Total Renovation Spending: {formatK(Number(kpi.total_spending_on_renovation?.toFixed(0)))}€</div>
            <div>% Houses Ready for Heat Network: {kpi.percentage_houses_ready_for_heat_network?.toFixed(0) ?? 0}%</div>
        </>
    );
};

export default KPIWindow;
