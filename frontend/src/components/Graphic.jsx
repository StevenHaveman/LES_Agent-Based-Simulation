import React, { useState } from 'react';

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
    Legend,
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
    Legend,
);

import PropTypes from 'prop-types';

import '../styles/Graphic.css';

import EnergyChart from '../charts/EnergyChart';
import Co2Chart from '../charts/Co2Chart';
import KpiChart from '../charts/KpiChart';
import ClusterChart from '../charts/ClusterChart';
import ClusterTrendChart from '../charts/ClusterTrendChart';
import BehaviorMetricsChart from '../charts/BehaviorMetricsChart';
import HistogramChart from '../charts/HistogramChart';

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
    'cluster_behavior_data',
    'cluster_behavior_trends',
    'behavior_metrics',
    'histogram',
];

const simulationYearStart = 2025;

const barPercentageNummer = 1.0;
const categoryPercentageNummer = 1.0;

const clusterMetrics = [
    {
        key: 'average_attitude',
        label: 'Attitude',
        color: '#00ffaa',
    },

    {
        key: 'average_perceived_norm',
        label: 'Perceived Norm',
        color: '#ff7801',
    },

    {
        key: 'average_pbc',
        label: 'Perceived Behavioral Control',
        color: '#238b23',
    },
];

const clusterColors = ['#2ac72a', '#5a5754', '#ff0000'];

const chartOptions = {
    responsive: true,

    interaction: {
        mode: 'index',
        intersect: false,
    },

    plugins: {
        legend: {
            position: 'top',
        },
    },

    scales: {
        x: {
            stacked: true,
        },

        y: {
            stacked: true,
        },
    },
};

const Graphic = ({
    title = '',
    yAxisKey = '',
    simulationData = [],
    households = [],
}) => {
    const [selectedClusterMetric, setSelectedClusterMetric] = useState(
        clusterMetrics[0].key,
    );

    const [selectedClusters, setSelectedClusters] = useState([
        'engaged',
        'neutral',
        'resistant',
    ]);

    const [selectedMetrics, setSelectedMetrics] = useState([
        'attitude',
    ]);

    const yKey = validKeys.includes(yAxisKey) ? yAxisKey : validKeys[0];

    const uniqueSimulationData = Array.from(
        new Map(simulationData.map((item) => [item.year, item])).values(),
    );
    const chartComponents = {
        co2: (
            <Co2Chart
                uniqueSimulationData={uniqueSimulationData}
                simulationYearStart={simulationYearStart}
            />
        ),

        kpi_stock: (
            <KpiChart
                uniqueSimulationData={uniqueSimulationData}
                simulationYearStart={simulationYearStart}
                chartOptions={chartOptions}
                barPercentageNummer={barPercentageNummer}
                categoryPercentageNummer={categoryPercentageNummer}
            />
        ),

        cluster_behavior_data: (
            <ClusterChart
                uniqueSimulationData={uniqueSimulationData}
                simulationYearStart={simulationYearStart}
                selectedClusterMetric={selectedClusterMetric}
                clusterMetrics={clusterMetrics}
                clusterColors={clusterColors}
                chartOptions={chartOptions}
            />
        ),

        cluster_behavior_trends: (
            <ClusterTrendChart
                uniqueSimulationData={uniqueSimulationData}
                simulationYearStart={simulationYearStart}
                selectedClusterMetric={selectedClusterMetric}
                clusterMetrics={clusterMetrics}
                clusterColors={clusterColors}
            />
        ),

        behavior_metrics: (
            <BehaviorMetricsChart
                uniqueSimulationData={uniqueSimulationData}
                simulationYearStart={simulationYearStart}
            />
        ),

        histogram: (
            <HistogramChart
                households={households}
                selectedClusters={selectedClusters}
                selectedMetrics={selectedMetrics}
            />
        ),
    };

    const selectedChart = yKey.startsWith('energy_label') ? (
        <EnergyChart
            uniqueSimulationData={uniqueSimulationData}
            simulationYearStart={simulationYearStart}
            chartOptions={chartOptions}
            barPercentageNummer={barPercentageNummer}
            categoryPercentageNummer={categoryPercentageNummer}
        />
    ) : (
        chartComponents[yKey]
    );

    const toggleCluster = (cluster) => {
        setSelectedClusters((prev) =>
            prev.includes(cluster)
                ? prev.filter((c) => c !== cluster)
                : [...prev, cluster],
        );
    };

    const toggleMetric = (metric) => {
        setSelectedMetrics((prev) =>
            prev.includes(metric)
                ? prev.filter((m) => m !== metric)
                : [...prev, metric],
        );
    };

    return (
        <div className="graphic-container">
            <h3 className="graphic-title">{title}</h3>

            {/* Cluster dropdown */}
            {(yKey === 'cluster_behavior_data' ||
        yKey === 'cluster_behavior_trends') && (
                <div style={{ marginBottom: '1em' }}>
                    <label htmlFor="cluster-metric-select">Select metric:</label>

                    <select
                        id="cluster-metric-select"
                        value={selectedClusterMetric}
                        onChange={(e) => setSelectedClusterMetric(e.target.value)}
                    >
                        {clusterMetrics.map((metric) => (
                            <option key={metric.key} value={metric.key}>
                                {metric.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {yKey === 'histogram' && (
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedClusters.includes('engaged')}
                            onChange={() => toggleCluster('engaged')}
                        />
                        Engaged
                    </label>

                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedClusters.includes('neutral')}
                            onChange={() => toggleCluster('neutral')}
                        />
                        Neutral
                    </label>

                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedClusters.includes('resistant')}
                            onChange={() => toggleCluster('resistant')}
                        />
                        Resistant
                    </label>

                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedMetrics.includes('attitude')}
                            onChange={() => toggleMetric('attitude')}
                        />
                        Attitude
                    </label>

                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedMetrics.includes('perceived_norm')}
                            onChange={() => toggleMetric('perceived_norm')}
                        />
                        Perceived Norm
                    </label>

                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="checkbox"
                            checked={selectedMetrics.includes('survey_pbc')}
                            onChange={() => toggleMetric('survey_pbc')}
                        />
                        Perceived Behavioral Control
                    </label>
                </div>
            )}

            <div className="graphic-square-wrapper">
                {selectedChart || <div>Invalid key</div>}
            </div>
        </div>
    );
};

Graphic.propTypes = {
    title: PropTypes.string,
    yAxisKey: PropTypes.string,
    simulationData: PropTypes.arrayOf(PropTypes.object),
    households: PropTypes.arrayOf(PropTypes.object),
};

export default Graphic;
