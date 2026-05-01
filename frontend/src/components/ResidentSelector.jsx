import React from 'react';
import PropTypes from 'prop-types';

const ResidentSelector = ({ residents, selectedResidentIndex, onSelect }) => {
    if (!residents || residents.length === 0) {
        return <div>No residents found.</div>;
    }

    return (
        <div className="resident-selector">
            <label htmlFor="resident-select">Select Resident:</label>
            <select
                id="resident-select"
                value={selectedResidentIndex}
                onChange={e => onSelect(Number(e.target.value))}
            >
                {residents.map((resident, idx) => (
                    <option key={idx} value={idx}>
                        {resident.name || `Resident ${idx + 1}`}
                    </option>
                ))}
            </select>
        </div>
    );
};

ResidentSelector.propTypes = {
    residents: PropTypes.array.isRequired,
    selectedResidentIndex: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

export default ResidentSelector;
