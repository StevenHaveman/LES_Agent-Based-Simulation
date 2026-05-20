import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ResidentInfo.css';

const ResidentInfo = ({ resident, home }) => {
    if (!resident) {
        return <div className="select-resident-hint">
            <h3> Click on a Resident</h3>
        </div>;
    }

    return (
        <div className="resident_info-container">
            <div className="info">
                <h3>Residence Information</h3>
                <h3>Address: {home.address}</h3>
                <h3>Performance category: {home.energyLabel}</h3>
                <h3>Total residents: {home.residents.length}</h3>
                <h3>Type home: {home.houseType}</h3>
                <hr className="resident-info-divider" />
                <h3>Resident Details</h3>
                <h3>Name: {resident.name}</h3>
                <h3>Income: €{resident.income + ',-'}</h3>
                <h4>Perceived Norm: {resident.perceived_norm.toFixed(2)}</h4>
                <h4>Norm Sensitivity: {resident.norm_sensitivity.toFixed(2)}</h4>
                <h4>Survey PBC: {resident.survey_pbc.toFixed(2)}</h4>
                <h4>Control Sensitivity: {typeof resident.control_sensitivity === 'number' ? resident.control_sensitivity.toFixed(2) : resident.control_sensitivity}</h4>
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
