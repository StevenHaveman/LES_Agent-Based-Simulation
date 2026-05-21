import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/ResidentInfo.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

const ResidentInfo = ({ resident, home }) => {
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await fetch('http://localhost:5000/households_historical');
                if (response.ok) {
                    const data = await response.json();
                    setHistoricalData(data);
                } else {
                    // Data not available yet (simulation hasn't run or no historical data)
                    console.log('No historical data available yet');
                }
            } catch (error) {
                console.error('Error fetching historical resident data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, []);

    if (!resident) {
        return <div className="select-resident-hint">
            <h3> Click on a Resident</h3>
        </div>;
    }

    // Extract resident score trends over time
    const getResidentTrends = () => {
        if (!historicalData || historicalData.length === 0) return null;

        const trends = { years: [], perceived_norm: [], survey_pbc: [], attitude: [] };

        historicalData.forEach(yearData => {
            if (yearData.households && Array.isArray(yearData.households)) {
                const household = yearData.households.find(hh => hh.residents.some(r => r.unique_id === resident.unique_id));
                if (household) {
                    const residentData = household.residents.find(r => r.unique_id === resident.unique_id);
                    if (residentData) {
                        trends.years.push((Number(yearData.year) || 0) + 2024);
                        trends.perceived_norm.push(residentData.perceived_norm || 0);
                        trends.survey_pbc.push(residentData.survey_pbc || 0);
                        trends.attitude.push(typeof residentData.attitude === 'number' ? residentData.attitude : 0);
                    }
                }
            }
        });

        return trends.years.length > 0 ? trends : null;
    };

    const trends = getResidentTrends();
    const trendChartData = trends ? {
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
            }
        ]
    } : null;

    return (
        <div className="resident_info-container">
            <div className="info">
                <h3>Residence Information</h3>
                {/* <p><strong>Address:</strong> {home.address}</p> */}
                <p><strong>Package level:</strong> {resident.kpi_level}</p>
                {/* <p><strong>Total residents:</strong> {home.residents.length}</p> */}
                <p><strong>Type home:</strong> {home.houseType}</p>
                <hr className="resident-info-divider" />
                <h3>Resident Details</h3>
                <p><strong>Name:</strong> {resident.name}</p>
                <p><strong>Income:</strong> €{resident.income + ',-'}</p>
                <p><strong>Perceived Norm:</strong> {resident.perceived_norm.toFixed(2)}</p>
                {/* <p><strong>Norm Sensitivity:</strong> {resident.norm_sensitivity.toFixed(2)}</p> */}
                <p><strong>Survey PBC:</strong> {resident.survey_pbc.toFixed(2)}</p>
                {/* <p><strong>Control Sensitivity:</strong> {typeof resident.control_sensitivity === 'number' ? resident.control_sensitivity.toFixed(2) : resident.control_sensitivity}</p> */}
                
                {trendChartData && !loading && (
                    <div className="resident-trends-section">
                        <hr className="resident-info-divider" />
                        <h3>Score Development Over Time</h3>
                        <div className="resident-trend-chart">
                            <Line
                                data={trendChartData}
                                options={{
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
                                    },
                                    scales: {
                                        y: {
                                            min: 0,
                                            max: 1,
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
                {!trendChartData && !loading && historicalData.length > 0 && (
                    <div className="resident-trends-section">
                        <hr className="resident-info-divider" />
                        <p style={{ fontSize: '0.9rem'}}>No historical data found for this resident.</p>
                    </div>
                )}
                {loading && (
                    <div className="resident-trends-section">
                        <p style={{ fontSize: '0.9rem'}}>Loading historical data...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

ResidentInfo.propTypes = {
    resident: PropTypes.shape({
        name: PropTypes.string.isRequired,
        income: PropTypes.number.isRequired,
        address: PropTypes.string,
    }),
    home: PropTypes.shape({
        address: PropTypes.string,
        energyLabel: PropTypes.string,
        residents: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                income: PropTypes.number,
                address: PropTypes.string,
            })
        ),
        houseType: PropTypes.string,
    }),
};

export default ResidentInfo;
