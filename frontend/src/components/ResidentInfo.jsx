import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';
import { averageResidentScores } from '../utils/residentStats';
import ResidentDropdown from './ResidentDropdown.jsx';
import HomeTrendChart from './HomeTrendChart.jsx';
import ResidentTrendChart from './ResidentTrendChart.jsx';
import '../styles/ResidentInfo.css';
import { getHomeTrends, getResidentTrends } from '../utils/trends';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const startYearSimulation = 2024;

const ResidentInfo = ({ resident, home, residents, selectedResidentIndex, onResidentChange, viewMode = 'resident' }) => {
    const [historicalData, setHistoricalData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                const response = await fetch('http://localhost:5000/households_historical');
                if (response.ok) {
                    setHistoricalData(await response.json());
                } else {
                    console.warn('No historical data available');
                }
            } catch (error) {
                console.error('Error fetching historical data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoricalData();
    }, [home, resident]);

    if (viewMode === 'resident' && !resident) {
        return <div className="select-resident-hint"><h3>Click on a Resident</h3></div>;
    }

    if (viewMode === 'home' && !home) {
        return <div className="select-resident-hint"><h3>Click on a Home</h3></div>;
    }

    const homeTrends = getHomeTrends(historicalData, home, startYearSimulation);
    const trends = getResidentTrends(historicalData, resident, startYearSimulation);
    const decibel = 2;
    const averageBehaviorScore = averageResidentScores(resident, ['attitude', 'perceived_norm', 'survey_pbc']);
    return (
        <div className="resident_info-container">
            <div className="info">
                {viewMode === 'home' && (
                    <>
                        <h3>Residence Information</h3>
                        <div className="info-list">
                            <div className="info-row">
                                <span className="info-label">Current KPI Level:</span>
                                <span className="info-value">{home?.residents?.[0]?.kpi_level || home?.GIS_attributes?.Energielabel || '-'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Type home:</span>
                                <span className="info-value">{home.houseType}</span>
                            </div>
                        </div>
                        {!loading && <HomeTrendChart homeTrends={homeTrends} />}
                    </>
                )}

                {viewMode === 'resident' && (
                    <>
                        <ResidentDropdown residents={residents || []} selectedResidentIndex={selectedResidentIndex} onSelect={onResidentChange} className="inline-selector" />
                        <h3>Resident Details</h3>
                        <div className="info-list">
                            <div className="info-row">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{resident.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Income:</span>
                                <span className="info-value">€{resident.income + ',-'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Cluster Type:</span>
                                <span className="info-value">{resident.cluster_type}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Attitude (Att):</span>
                                <span className="info-value">{resident.attitude.toFixed(decibel)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Perceived Norm (PN):</span>
                                <span className="info-value">{resident.perceived_norm.toFixed(decibel)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Perceived Behaviour Control (PBC):</span>
                                <span className="info-value">{resident.survey_pbc.toFixed(decibel)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Average Total:</span>
                                <span className="info-value">{averageBehaviorScore.toFixed(decibel)}</span>
                            </div>
                        </div>
                        <ResidentTrendChart trends={trends} loading={loading} historicalData={historicalData} />
                    </>
                )}
            </div>
        </div>
    );
};

ResidentInfo.propTypes = {
    viewMode: PropTypes.oneOf(['resident', 'home']),
    residents: PropTypes.arrayOf(PropTypes.shape({ unique_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string, income: PropTypes.number })),
    selectedResidentIndex: PropTypes.number,
    onResidentChange: PropTypes.func,
    resident: PropTypes.shape({
        unique_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        income: PropTypes.number.isRequired,
        kpi_level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        perceived_norm: PropTypes.number,
        survey_pbc: PropTypes.number,
        cluster_type: PropTypes.string,
        attitude: PropTypes.number,
        address: PropTypes.string,
    }),
    home: PropTypes.shape({
        address: PropTypes.string,
        energyLabel: PropTypes.string,
        residents: PropTypes.arrayOf(PropTypes.shape({ unique_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string, income: PropTypes.number, address: PropTypes.string })),
        houseType: PropTypes.string,
    }),
};

export default ResidentInfo;
