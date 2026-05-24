import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const ClusterChart = ({
    uniqueSimulationData,
    simulationYearStart,
    selectedClusterMetric,
    clusterMetrics,
    clusterColors,
    chartOptions
}) => {

    const clusters = new Set();

    uniqueSimulationData.forEach(item => {
        if (item.cluster_behavior_data) {
            Object.keys(item.cluster_behavior_data)
                .forEach(cluster => clusters.add(cluster));
        }
    });

    const clusterList = Array.from(clusters);

    const metric =
        clusterMetrics.find(m => m.key === selectedClusterMetric)
        || clusterMetrics[0];

    const datasets = clusterList.map((cluster, cIdx) => ({
        label: cluster,

        data: uniqueSimulationData.map(item =>
            item.cluster_behavior_data?.[cluster]?.[metric.key] || 0
        ),

        backgroundColor: `${clusterColors[cIdx] || metric.color}CC`,

        borderColor: clusterColors[cIdx] || metric.color,

        barPercentage: 0.7,
        categoryPercentage: 0.7,
    }));

    const clusterChartData = {
        labels: uniqueSimulationData.map(
            (_, idx) => simulationYearStart + idx
        ),

        datasets
    };

    return (
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
    );
};

export default ClusterChart;

ClusterChart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
    selectedClusterMetric: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clusterMetrics: PropTypes.arrayOf(PropTypes.object),
    clusterColors: PropTypes.arrayOf(PropTypes.string),
    chartOptions: PropTypes.object,
};
