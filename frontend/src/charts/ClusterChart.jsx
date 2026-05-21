import React from 'react';
import { Bar } from 'react-chartjs-2';

const backgroundOpacities = ['99', '66', '33'];

const ClusterChart = ({
    uniqueSimulationData,
    simulationYearStart,
    selectedClusterMetric,
    clusterMetrics,
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

        backgroundColor:
            `${metric.color}${backgroundOpacities[cIdx] || '33'}`,

        borderColor: metric.color,

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