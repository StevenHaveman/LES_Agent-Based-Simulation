import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const Co2Chart = ({
    uniqueSimulationData,
    simulationYearStart
}) => {

    const co2ChartData = {
        labels: uniqueSimulationData.map(
            (_, idx) => simulationYearStart + idx
        ),

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
        maintainAspectRatio: false,

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

    return (
        <Line
            data={co2ChartData}
            options={co2ChartOptions}
        />
    );
};

export default Co2Chart;

Co2Chart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
};
