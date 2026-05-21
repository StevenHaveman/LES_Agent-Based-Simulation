import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const borderOpacities = ['FF', 'CC', '99'];
const backgroundOpacities = ['33', '22', '11'];

const ClusterTrendChart = ({
    uniqueSimulationData,
    simulationYearStart,
    selectedClusterMetric,
    clusterMetrics
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

        borderColor:
            `${metric.color}${borderOpacities[cIdx] || '99'}`,

        backgroundColor:
            `${metric.color}${backgroundOpacities[cIdx] || '11'}`,

        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
    }));

    const clusterTrendChartData = {
        labels: uniqueSimulationData.map(
            (_, idx) => simulationYearStart + idx
        ),

        datasets
    };

    return (
        <Line
            data={clusterTrendChartData}
            options={{
                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    mode: 'index',
                    intersect: false
                },

                plugins: {
                    legend: { position: 'top' }
                },

                scales: {
                    x: { stacked: false },

                    y: {
                        stacked: false,
                        min: 0,
                        max: 1
                    }
                }
            }}
        />
    );
};

export default ClusterTrendChart;

ClusterTrendChart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
    selectedClusterMetric: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clusterMetrics: PropTypes.arrayOf(PropTypes.object),
};
