import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const createHistogram = (values, binCount = 10) => {
    const bins = Array(binCount).fill(0);

    values.forEach(value => {
        const index = Math.min(
            Math.floor(value * binCount),
            binCount - 1
        );

        bins[index]++;
    });

    return {
        labels: bins.map((_, i) => {
            const start = (i / binCount).toFixed(1);
            const end = ((i + 1) / binCount).toFixed(1);

            return `${start}-${end}`;
        }),

        counts: bins
    };
};

const HistogramChart = ({ households }) => {

    const attitudeValues = households.flatMap(
        h => h.residents?.map(r => r.attitude) || []
    );

    const normValues = households.flatMap(
        h => h.residents?.map(r => r.perceived_norm) || []
    );

    const pbcValues = households.flatMap(
        h => h.residents?.map(r => r.survey_pbc) || []
    );

    const attitudeHistogram = createHistogram(attitudeValues);
    const normHistogram = createHistogram(normValues);
    const pbcHistogram = createHistogram(pbcValues);

    const data = {
        labels: attitudeHistogram.labels,

        datasets: [
            {
                label: 'Attitude',
                data: attitudeHistogram.counts,
                borderColor: '#00ffaa',
                backgroundColor: '#00ffaa22',
                tension: 0.4,
                fill: false,
            },

            {
                label: 'Perceived Norm',
                data: normHistogram.counts,
                borderColor: '#ff7801',
                backgroundColor: '#ff780122',
                tension: 0.4,
                fill: false,
            },

            {
                label: 'Perceived Behavioral Control',
                data: pbcHistogram.counts,
                borderColor: '#238b23',
                backgroundColor: '#238b2322',
                tension: 0.4,
                fill: false,
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
                        display: false
                    }
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Value Range (0-1)'
                        }
                    },

                    y: {
                        title: {
                            display: true,
                            text: 'Residents'
                        },

                        beginAtZero: true
                    }
                }
            }}
        />
    );
};

HistogramChart.propTypes = {
    households: PropTypes.array.isRequired,
};

export default HistogramChart;