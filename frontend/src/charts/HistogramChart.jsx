import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

/* eslint-disable */
// Bins are the x axis for the histogram
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

            return ((i + 0.5) / binCount).toFixed(1);
        }),

        counts: bins
    };
};
/* eslint-enable */
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
                backgroundColor: '#d6272855',
                borderColor: '#d62728',
                borderWidth: 1,
            },
            {
                label: 'Perceived Norm',
                data: normHistogram.counts,
                backgroundColor: '#2ca02c55',
                borderColor: '#2ca02c',
                borderWidth: 1,
            },
            {
                label: 'Perceived Behavioral Control',
                data: pbcHistogram.counts,
                backgroundColor: '#ff7f0e55',
                borderColor: '#ff7f0e',
                borderWidth: 1,
            }
        ]
    };

    return (
        <Bar
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
                        stacked: false
                    },
                    y: {
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
