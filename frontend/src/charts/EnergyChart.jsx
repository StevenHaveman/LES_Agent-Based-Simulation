import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const EnergyChart = ({
    uniqueSimulationData,
    simulationYearStart,
    chartOptions,
    barPercentageNummer,
    categoryPercentageNummer
}) => {

    const chartData = {
        labels: uniqueSimulationData.map(
            (_, idx) => simulationYearStart + idx
        ),

        datasets: [
            {
                label: 'A',
                data: uniqueSimulationData.map(item => item.housing_stock.A),
                backgroundColor: '#22B14C',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'B',
                data: uniqueSimulationData.map(item => item.housing_stock.B),
                backgroundColor: '#B5E61D',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'C',
                data: uniqueSimulationData.map(item => item.housing_stock.C),
                backgroundColor: '#FFF200',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'D',
                data: uniqueSimulationData.map(item => item.housing_stock.D),
                backgroundColor: '#FFA800',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'E',
                data: uniqueSimulationData.map(item => item.housing_stock.E),
                backgroundColor: '#FF3C00',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'F',
                data: uniqueSimulationData.map(item => item.housing_stock.F),
                backgroundColor: '#ED1C24',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'G',
                data: uniqueSimulationData.map(item => item.housing_stock.G),
                backgroundColor: '#880015',
                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
        ],
    };

    return (
        <Bar
            data={chartData}
            options={chartOptions}
        />
    );
};

export default EnergyChart;

EnergyChart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
    chartOptions: PropTypes.object,
    barPercentageNummer: PropTypes.number,
    categoryPercentageNummer: PropTypes.number,
};
