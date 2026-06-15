import React from 'react';
import '../styles/KPIWindow.css';
import { useOverview } from '../hooks/useOverview.js';
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

    React.useEffect(() => {
        async function fetch_data() {
            try {
                set_house_hold_data(await useOverview().fetchHouseholds());
                set_sim_config(await useOverview().fetchSimulationConfig());
                set_kpi_data(await useOverview().fetchKPIData());
            } catch (error) {
                console.error(
                    'error fetching household or KPI data:',
                    error
                );
            }

            set_loading(false);
        }

        if (year !== null) {
            fetch_data();
        }
    }, [year]);

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
    /* eslint-disable */
    const totalCo2ReducedPercent = kpi.co2_emissions_start_simulation
        ? (Number(kpi.total_co2_reduced || 0) / Number(kpi.co2_emissions_start_simulation)) * 100  
        : 0;
    /* eslint-enable */
    return (
        <>
            <div className="kpi-window">
                {/* <h3>Solar Panels: {Math.round((counted_solar_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Heat Pumps: {Math.round((counted_heat_pump_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Fully Converted: {Math.round((counted_full_data_hh / house_hold_data.length) * percentFactor)}%</h3>
            <h3>Average Income: {Math.round(avg_income)}€</h3>
            <h3>Subjective Norm ({sim_config.subj_norm_level}): {sim_config.subjective_norm}</h3> */}
                <h3>Neighborhood KPI&apos;s</h3>
                <div className="info-list kpi-list">
                    <div className="info-row">
                        <span className="info-label">Emissions in 2025:</span>
                        <span className="info-value">{formatT(Number(kpi.co2_emissions_start_simulation?.toFixed(0)))} CO₂</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Emissions in{year !== null ? ` ${year + simulationYearStart}` : ''}:</span>
                        <span className="info-value">{formatT(Number(kpi.current_co2_emissions?.toFixed(0)))} CO₂</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Total CO2 Reduced:</span>
                        <span className="info-value">{totalCo2ReducedPercent.toFixed(0)}%</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Total CO2 Emitted:</span>
                        <span className="info-value">{formatT(Number(kpi.total_co2_emitted_during_simulation?.toFixed(0)))} CO₂</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Total Renovation Spending:</span>
                        <span className="info-value">{formatK(Number(kpi.total_spending_on_renovation?.toFixed(0)))}€</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">% Houses Ready for Heat Network:</span>
                        <span className="info-value">{kpi.percentage_houses_ready_for_heat_network?.toFixed(0) ?? 0}%</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default KPIWindow;
