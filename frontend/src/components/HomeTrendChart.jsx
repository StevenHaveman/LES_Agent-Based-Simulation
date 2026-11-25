import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { KPI_RANK, RANK_KPI } from '../utils/trends';

const HomeTrendChart = ({ homeTrends }) => {
    if (!homeTrends) {return null;}

    try {
        const homeChartData = {
            labels: homeTrends.years || [],
            datasets: [
                {
                    label: 'Household Performance category',
                    data: (homeTrends.kpi_level || []).map(level => {
                        if (level === null || level === undefined) {return null;}
                        if (typeof level === 'string') {
                            const normalized = level.trim().toLowerCase();
                            if (KPI_RANK[normalized]) {return KPI_RANK[normalized];}
                        }
                        const n = Number(level);
                        return Number.isFinite(n) ? n : null;
                    }),
                    borderColor: '#188cde',
                    backgroundColor: '#1f77b433',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    yAxisID: 'y1',
                },
                {
                    label: 'Avg Income (€)',
                    data: (homeTrends.avg_income || []).map(v => {
                        if (v === null || v === undefined) {return null;}
                        const n = Number(v);
                        return Number.isFinite(n) ? n : null;
                    }),
                    borderColor: '#4ca216',
                    backgroundColor: '#4ca21633',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    yAxisID: 'y',
                },
            ],
        };

        return (
            <div className="resident-trends-section">
                <hr className="resident-info-divider" />
                <h3>Household History</h3>
                <div className="resident-trend-chart">
                    <Line
                        data={homeChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: { mode: 'index', intersect: false },
                            plugins: { legend: { position: 'top' } },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: { display: true, text: 'Avg Income (€)' },
                                },
                                y1: {
                                    type: 'linear',
                                    position: 'right',
                                    min: 1,
                                    max: 5,
                                    ticks: {
                                        stepSize: 1,
                                        callback: function(value) { return RANK_KPI[value] || ''; },
                                    },
                                    title: { display: true, text: 'KPI Level' },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    } catch (err) {
        console.error('Error rendering home chart:', err);
        return <div style={{ color: 'red' }}>Error loading chart data</div>;
    }
};

HomeTrendChart.propTypes = {
    homeTrends: PropTypes.shape({
        years: PropTypes.array,
        kpi_level: PropTypes.array,
        avg_income: PropTypes.array,
    }),
};

export default HomeTrendChart;
