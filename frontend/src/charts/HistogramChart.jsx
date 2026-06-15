import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

/* eslint-disable */
// Bins are the x axis for the histogram
const createHistogram = (values, binCount = 5) => {
  const bins = Array(binCount).fill(0);

  values.forEach((value) => {
    const index = Math.min(Math.floor(value * binCount), binCount - 1);

    bins[index]++;
  });
  return {
    labels: bins.map((_, i) => {
      const start = (i / binCount).toFixed(1);
      const end = ((i + 1) / binCount).toFixed(1);

      return ((i + 0.5) / binCount).toFixed(1);
    }),

    counts: bins,
  };
};
/* eslint-enable */
const HistogramChart = ({ households, selectedClusters }) => {
    const metrics = [
        {
            key: 'attitude',
            label: 'Attitude',
            color: '#d62728',
        },
        {
            key: 'perceived_norm',
            label: 'Perceived Norm',
            color: '#2ca02c',
        },
        {
            key: 'survey_pbc',
            label: 'Perceived Behavioral Control',
            color: '#ff7f0e',
        },
    ];

    const datasets = [];

    selectedClusters.forEach((cluster) => {
        metrics.forEach((metric) => {
            const values = households.flatMap(
                (h) =>
                    h.residents
                        ?.filter((r) => r.cluster_type === cluster)
                        .map((r) => r[metric.key]) || [],
            );

            const histogram = createHistogram(values);

            datasets.push({
                label: `${metric.label}-${cluster}`,
                data: histogram.counts,
                backgroundColor: metric.color,
                borderColor: metric.color,
                borderWidth: 1,
            });
        });
    });

    const data = {
        labels: createHistogram([]).labels,
        datasets,
    };

    return (
        <Bar
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false,
                    },
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Behavioral Score',
                        },
                        stacked: false,
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Residents',
                        },
                        beginAtZero: true,
                    },
                },
            }}
        />
    );
};

HistogramChart.propTypes = {
    households: PropTypes.array.isRequired,
    selectedClusters: PropTypes.array.isRequired,
};

export default HistogramChart;
