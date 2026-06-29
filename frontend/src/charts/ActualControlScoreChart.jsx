import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const packageOrder = ['Bad', 'Poor', 'Medium', 'OK', 'Good'];

const ActualControlScoreChart = ({
    currentPerformanceCategory,
    actualControl,
}) => {

    if (currentPerformanceCategory === 'Good') {
        return null;
    }
    const currentIndex = packageOrder.indexOf(currentPerformanceCategory);

    const availablePackages = packageOrder.slice(currentIndex + 1);

    const values = availablePackages
        .map(pkg => ({
            label: pkg,
            value: actualControl[`${currentPerformanceCategory}->${pkg}`],
        }))
        .filter(item => item.value !== undefined);

    const chartData = {
        labels: values.map(v => v.label),
        datasets: [{
            label: 'Actual Control Score',
            data: values.map(v => v.value),
            backgroundColor: 'rgba(247, 102, 255, 0.6)',
        }],
    };

    return (
        <Bar
            data={chartData}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    );
};

export default ActualControlScoreChart;

ActualControlScoreChart.propTypes = {
    currentPerformanceCategory: PropTypes.string.isRequired,
    actualControl: PropTypes.object.isRequired,
};
