/**
 * Graphic Component
 *
 * This React component displays a simulation graph based on the provided data.
 * It uses the `recharts` library to render a responsive line chart with data points
 * representing the start and end states of a simulation year.
 *
 * Props:
 * - `title` (string): The title of the graph. Defaults to an empty string.
 * - `yAxisKey` (string): The key for the Y-axis data. Valid keys include:
 *   - "solar_panel_price"
 *   - "heat_pump_price"
 *   - "solar_panel_households"
 *   - "solar_panel_positive_decisions"
 *   If an invalid key is provided, the first valid key is used as a fallback.
 *
 * State:
 * - `simulationData` (Array): The fetched simulation data used to populate the graph.
 * - `loading` (boolean): Indicates whether the data is still being fetched.
 *
 * Effects:
 * - Fetches simulation data and polling delay on component mount.
 * - Sets up an interval to periodically fetch simulation data based on the polling delay.
 * - Cleans up the interval on component unmount.
 *
 * Methods:
 * - `fetchData()`: Fetches simulation data from the backend.
 * - `fetchInterval()`: Fetches the polling delay and sets up periodic data fetching.
 *
 * Returns:
 * - A responsive line chart displaying the simulation data for the selected Y-axis key.
 * - A loading message if the data is still being fetched.
 */

import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

import { Bar, Line } from 'react-chartjs-2';

import PropTypes from 'prop-types';

import '../styles/Graphic.css';
import { useOverview } from '../hooks/useOverview.js';
import { useSimulationRun } from '../hooks/useSimulationRun.js';
import { flattenSimulationData } from '../utils/flattenSimulationData.js';

const validKeys = [
    'energy_label_A',
    'energy_label_B',
    'energy_label_C',
    'energy_label_D',
    'energy_label_E',
    'energy_label_F',
    'energy_label_G',
    'co2'
];

const delayMs = 1000;
const defaultSimulationDelaySeconds = 3;

const Graphic = ({ title = '', yAxisKey = '' }) => {
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];
    const isEnergyChart = yKey.startsWith('energy_label');
    const isCo2Chart = yKey === 'co2';

    const energyData = simulationData.map(item => ({
        year: item.year,
        A: item.housing_stock.A,
        B: item.housing_stock.B,
        C: item.housing_stock.C,
        D: item.housing_stock.D,
        E: item.housing_stock.E,
        F: item.housing_stock.F,
        G: item.housing_stock.G
    }));

    useEffect(() => {
        let intervalId;

        const fetchData = async () => {
            try {
                const result = await useOverview().getSimulationGraphicResults();
                setSimulationData(result);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching simulation data', error);
                setLoading(false);
            }
        };

        const fetchInterval = async () => {
            const res = await useSimulationRun().getSimulationDelay();
            const delay = parseInt(res.delay || defaultSimulationDelaySeconds) * delayMs;

            await fetchData();

            intervalId = setInterval(fetchData, delay);
        };

        fetchInterval();

        return () => {
            if (intervalId) {clearInterval(intervalId);}
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const flattenedData = flattenSimulationData(simulationData, yKey);
    
    const yValues = flattenedData.map(d => d.value);
    const yMin = Math.floor(Math.min(...yValues));
    const yMax = Math.ceil(Math.max(...yValues));

    const uniqueSimulationData = Array.from(
        new Map(
            simulationData.map(item => [item.year, item])
        ).values()
    );
    
    const barPercentageNummer = 1.0;
    const categoryPercentageNummer = 1.0;

    const co2ChartData = {
        labels: uniqueSimulationData.map((_, idx) => 2025 + idx),

        datasets: [
            {
                label: 'Baseline Emissions',
                data: uniqueSimulationData.map(
                    item => item.co2_data.baseline_emissions
                ),

                borderColor: '#888888',
                backgroundColor: '#88888833',

                fill: true,

                tension: 0.3
            },

            {
                label: 'Yearly Emissions',
                data: uniqueSimulationData.map(
                    item => item.co2_data.yearly_emissions
                ),

                borderColor: '#1bc04d',
                backgroundColor: '#22B14C33',

                fill: true,

                tension: 0.3
            }
        ]
    };

    const co2ChartOptions = {
        responsive: true,

        interaction: {
            mode: 'index',
            intersect: false
        },

        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    const chartData = {
        labels: uniqueSimulationData.map((_, idx) => 2025 + idx),

        datasets: [
            {
                label: 'A',
                data: uniqueSimulationData.map((item) => item.housing_stock.A),
                backgroundColor: '#22B14C',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'B',
                data: uniqueSimulationData.map((item) => item.housing_stock.B),
                backgroundColor: '#B5E61D',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'C',
                data: uniqueSimulationData.map((item) => item.housing_stock.C),
                backgroundColor: '#FFF200',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'D',
                data: uniqueSimulationData.map((item) => item.housing_stock.D),
                backgroundColor: '#FFA800',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'E',
                data: uniqueSimulationData.map((item) => item.housing_stock.E),
                backgroundColor: '#FF3C00',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'F',
                data: uniqueSimulationData.map((item) => item.housing_stock.F),
                backgroundColor: '#ED1C24',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'G',
                data: uniqueSimulationData.map((item) => item.housing_stock.G),
                backgroundColor: '#880015',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
        ],
    };

    const chartOptions = {
        responsive: true,

        interaction: {
            mode: 'index',
            intersect: false
        },

        plugins: {
            legend: {
                position: 'top'
            }
        },

        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        }
    };

    return (
        <div className="graphic-container">
            <h3 className="graphic-title">{title}</h3>
            <div className="graphic-square-wrapper">
                {isEnergyChart ? (
                    <Bar
                        data={chartData}
                        options={chartOptions}
                    />
                ) : isCo2Chart ? (
                    <Line
                        data={co2ChartData}
                        options={co2ChartOptions}
                    />
                ) : (<div>Invalid key</div>
                )}
            </div> 
        </div>
    );
};

Graphic.propTypes = {
    title: PropTypes.string,
    yAxisKey: PropTypes.string
};

export default Graphic;
