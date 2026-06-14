import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const BehaviorMetricsChart = ({
    uniqueSimulationData,
    simulationYearStart,
    cluster
}) => {
    const clusterKey =
        cluster && uniqueSimulationData.some(item => item.cluster_behavior_data?.[cluster])
            ? cluster
            : Object.keys(
                uniqueSimulationData.find(item => item.cluster_behavior_data)
                    ?.cluster_behavior_data || {}
            )[0];

    const labels = uniqueSimulationData.map(
        (_, idx) => simulationYearStart + idx
    );

    const data = {
        labels,
        datasets: [
            {
                label: 'Attitude',
                data: uniqueSimulationData.map(
                    item =>
                        item.cluster_behavior_data?.[clusterKey]
                            ?.average_attitude ?? 0
                ),
                borderColor: '#c2185b',
                backgroundColor: '#c2185b33',
                tension: 0.4,
            },
            {
                label: 'Perceived Norm',
                data: uniqueSimulationData.map(
                    item =>
                        item.cluster_behavior_data?.[clusterKey]
                            ?.average_perceived_norm ?? 0
                ),
                borderColor: '#4caf50',
                backgroundColor: '#4caf5033',
                tension: 0.4,
            },
            {
                label: 'Perceived Behavioral Control',
                data: uniqueSimulationData.map(
                    item =>
                        item.cluster_behavior_data?.[clusterKey]
                            ?.average_pbc ?? 0
                ),
                borderColor: '#2196f3',
                backgroundColor: '#2196f333',
                tension: 0.4,
            },
        ],
    };

    return (
        <Line
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        min: 0,
                        max: 1,
                    },
                },
            }}
        />
    );
};

export default BehaviorMetricsChart;

BehaviorMetricsChart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
    cluster: PropTypes.string,
};