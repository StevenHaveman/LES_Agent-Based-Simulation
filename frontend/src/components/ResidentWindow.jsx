import React from 'react';
import PropTypes from 'prop-types';

import '../styles/ResidentWindow.css';
import ResidentInfo from './ResidentInfo.jsx';
import { useOverviewState } from '../state/overviewState.jsx';

const ResidentWindow = ({ residents, selectedResidentIndex, home, onResidentChange }) => {
    const state = useOverviewState();

    const selectedResident = residents && selectedResidentIndex !== null
        ? residents[selectedResidentIndex]
        : null;

    const renderContent = () => {
        switch (state.residentWindow) {
            case 'info-home':
                return (
                    <ResidentInfo
                        resident={selectedResident}
                        home={home}
                        viewMode="home"
                    />
                );
            case 'info-resident':
            default:
                return (
                    <ResidentInfo
                        resident={selectedResident}
                        residents={residents}
                        selectedResidentIndex={selectedResidentIndex}
                        onResidentChange={onResidentChange}
                        home={home}
                        viewMode="resident"
                    />
                );
        }
    };

    return renderContent();
};

ResidentWindow.propTypes = {
    residents: PropTypes.arrayOf(
        PropTypes.shape({
            unique_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            income: PropTypes.number,
        }),
    ).isRequired,
    selectedResidentIndex: PropTypes.number,
    home: PropTypes.shape({
        houseType: PropTypes.string,
    }),
    onResidentChange: PropTypes.func.isRequired,
};

export default ResidentWindow;
