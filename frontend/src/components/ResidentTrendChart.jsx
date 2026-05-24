import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const ResidentTrendChart = ({ trends, loading, historicalData }) => {
    if (!trends) {
        if (!loading && historicalData.length > 0) {
            return (
                <div className="resident-trends-section">
                    <hr className="resident-info-divider" />
                    <p style={{ fontSize: '0.9rem' }}>No historical data found.</p>
                </div>
            );
        }
        if (loading) {
            return (
                <div className="resident-trends-section">
                    <p style={{ fontSize: '0.9rem' }}>Loading historical data...</p>
                </div>
            );
        }
        return null;
    }

    const trendChartData = {
        labels: trends.years,
        datasets: [
            {
                label: 'Perceived Norm',
                data: trends.perceived_norm,
                borderColor: '#ff7f0e',
                backgroundColor: '#ff7f0e33',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Survey PBC',
                data: trends.survey_pbc,
                borderColor: '#2ca02c',
                backgroundColor: '#2ca02c33',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Attitude',
                data: trends.attitude,
                borderColor: '#d62728',
                backgroundColor: '#d6272833',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    return (
        <div className="resident-trends-section">
            <hr className="resident-info-divider" />
            <h3>Score Development Over Time</h3>
            <div className="resident-trend-chart">
                <Line
                    data={trendChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { min: 0, max: 1, beginAtZero: true } },
                    }}
                />
            </div>
        </div>
    );
};

ResidentTrendChart.propTypes = {
    trends: PropTypes.shape({
        years: PropTypes.array,
        perceived_norm: PropTypes.array,
        survey_pbc: PropTypes.array,
        attitude: PropTypes.array,
    }),
    loading: PropTypes.bool,
    historicalData: PropTypes.array,
};

export default ResidentTrendChart;
