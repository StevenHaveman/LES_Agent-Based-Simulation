import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const KpiChart = ({
    uniqueSimulationData,
    simulationYearStart,
    chartOptions,
    barPercentageNummer,
    categoryPercentageNummer
}) => {

    const kpiChartData = {
        labels: uniqueSimulationData.map(
            (_, idx) => simulationYearStart + idx
        ),

        datasets: [
            {
                label: 'Bad',

                data: uniqueSimulationData.map(
                    item => item.kpi_stock
                        ? item.kpi_stock.Bad
                        : 0
                ),

                backgroundColor: '#880015',

                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'Poor',

                data: uniqueSimulationData.map(
                    item => item.kpi_stock
                        ? item.kpi_stock.Poor
                        : 0
                ),

                backgroundColor: '#ED1C24',

                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'Medium',

                data: uniqueSimulationData.map(
                    item => item.kpi_stock
                        ? item.kpi_stock.Medium
                        : 0
                ),

                backgroundColor: '#FFA800',

                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'OK',

                data: uniqueSimulationData.map(
                    item => item.kpi_stock
                        ? item.kpi_stock.OK
                        : 0
                ),

                backgroundColor: '#FFF200',

                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },

            {
                label: 'Good',

                data: uniqueSimulationData.map(
                    item => item.kpi_stock
                        ? item.kpi_stock.Good
                        : 0
                ),

                backgroundColor: '#22B14C',

                barPercentage: barPercentageNummer,
                categoryPercentage: categoryPercentageNummer,
            },
        ],
    };

    return (
        <Bar
            data={kpiChartData}
            options={chartOptions}
        />
    );
};

export default KpiChart;

KpiChart.propTypes = {
    uniqueSimulationData: PropTypes.arrayOf(PropTypes.object).isRequired,
    simulationYearStart: PropTypes.number,
    chartOptions: PropTypes.object,
    barPercentageNummer: PropTypes.number,
    categoryPercentageNummer: PropTypes.number,
};
