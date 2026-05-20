
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

const validKeys = [
    'energy_label_A',
    'energy_label_B',
    'energy_label_C',
    'energy_label_D',
    'energy_label_E',
    'energy_label_F',
    'energy_label_G',
    'co2',
    'kpi_stock',
    'cluster_behavior_data'
];

const delayMs = 1000;
const defaultSimulationDelaySeconds = 3;
const simulationYearStart = 2025;


const clusterMetrics = [
    { key: 'average_attitude', label: 'Attitude', color: '#1f77b4' },
    { key: 'average_perceived_norm', label: 'Perceived Norm', color: '#ff7f0e' },
    { key: 'average_pbc', label: 'PBC', color: '#2ca02c' }
];

const Graphic = ({ title = '', yAxisKey = '' }) => {
    const [simulationData, setSimulationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClusterMetric, setSelectedClusterMetric] = useState(clusterMetrics[0].key);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];
    const isEnergyChart = yKey.startsWith('energy_label');
    const isCo2Chart = yKey === 'co2';
    const isKpiChart = yKey === 'kpi_stock';
    const isClusterChart = yKey === 'cluster_behavior_data';

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

    const uniqueSimulationData = Array.from(
        new Map(
            simulationData.map(item => [item.year, item])
        ).values()
    );
    
    const barPercentageNummer = 1.0;
    const categoryPercentageNummer = 1.0;

    const co2ChartData = {
        labels: uniqueSimulationData.map((_, idx) => simulationYearStart + idx),

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


    const kpiChartData = {
        labels: uniqueSimulationData.map((_, idx) => simulationYearStart + idx),
        datasets: [
            {
                label: 'Bad',
                data: uniqueSimulationData.map((item) => item.kpi_stock ? item.kpi_stock.Bad : 0),
                backgroundColor: '#880015',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'Poor',
                data: uniqueSimulationData.map((item) => item.kpi_stock ? item.kpi_stock.Poor : 0),
                backgroundColor: '#ED1C24',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'Medium',
                data: uniqueSimulationData.map((item) => item.kpi_stock ? item.kpi_stock.Medium : 0),
                backgroundColor: '#FFA800',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'OK',
                data: uniqueSimulationData.map((item) => item.kpi_stock ? item.kpi_stock.OK : 0),
                backgroundColor: '#FFF200',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
            {
                label: 'Good',
                data: uniqueSimulationData.map((item) => item.kpi_stock ? item.kpi_stock.Good : 0),
                backgroundColor: '#22B14C',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
        ],
    };

    const clusterChartData = (() => {
        const clusters = new Set();
        uniqueSimulationData.forEach(item => {
            if (item.cluster_behavior_data) {
                Object.keys(item.cluster_behavior_data).forEach(cluster => clusters.add(cluster));
            }
        });
        const clusterList = Array.from(clusters);
        const metric = clusterMetrics.find(m => m.key === selectedClusterMetric) || clusterMetrics[0];
        const datasets = clusterList.map((cluster, cIdx) => ({
            label: cluster,
            data: uniqueSimulationData.map(item =>
                item.cluster_behavior_data && item.cluster_behavior_data[cluster]
                    ? item.cluster_behavior_data[cluster][metric.key]
                    : 0
            ),
            backgroundColor: metric.color + (cIdx === 0 ? '99' : cIdx === 1 ? '66' : '33'),
            borderColor: metric.color,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
        }));
        return {
            labels: uniqueSimulationData.map((_, idx) => simulationYearStart + idx),
            datasets
        };
    })();
    
    const chartData = {
        labels: uniqueSimulationData.map((_, idx) => simulationYearStart + idx),
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
            {isClusterChart && (
                <div style={{ marginBottom: '1em' }}>
                    <label htmlFor="cluster-metric-select">Select metric:&nbsp;</label>
                    <select
                        id="cluster-metric-select"
                        value={selectedClusterMetric}
                        onChange={e => setSelectedClusterMetric(e.target.value)}
                    >
                        {clusterMetrics.map(metric => (
                            <option key={metric.key} value={metric.key}>{metric.label}</option>
                        ))}
                    </select>
                </div>
            )}
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
                ) : isKpiChart ? (
                    <Bar
                        data={kpiChartData}
                        options={chartOptions}
                    />
                ) : isClusterChart ? (
                    <Bar
                        data={clusterChartData}
                        options={{
                            ...chartOptions,
                            scales: {
                                x: { stacked: false },
                                y: { stacked: false }
                            },
                            plugins: {
                                legend: { position: 'top' }
                            }
                        }}
                    />
                ) : (
                    <div>Invalid key</div>
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
