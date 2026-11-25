import '../styles/ResidentDropdown.css';
import '../styles/SharedListStyles.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useOverviewDispatch } from '../state/overviewState.jsx';

const ResidentDropdown = ({ residents, selectedResidentIndex, onSelect, className = '' }) => {
    // State to track whether the dropdown menu is open or closed.
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useOverviewDispatch();

    const handleResidentClick = (index) => {
        if (onSelect) {
            onSelect(index);
        } else {
            dispatch({ type: 'SELECT_RESIDENT', payload: index });
        }
        setIsOpen(false);
    };

    return (
        <div className={`dropdown-container ${className}`.trim()}>
            <div className="dropdown">
                {/* Button to toggle the dropdown menu */}
                <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {residents[selectedResidentIndex]?.name || 'Select Resident...'} ▼
                </button>
                {/* Dropdown menu displaying the list of residents */}
                {isOpen && (
                    <ul className="dropdown-menu">
                        {residents && residents.length > 0 ? (
                            residents.map((resident, index) => (
                                <li key={index} onClick={() => handleResidentClick(index)}>
                                    {resident.name}
                                </li>
                            ))
                        ) : (
                            <li>Geen residents beschikbaar</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

ResidentDropdown.propTypes = {
    residents: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            income: PropTypes.number.isRequired,
        })
    ).isRequired,
    selectedResidentIndex: PropTypes.number,
    onSelect: PropTypes.func,
    className: PropTypes.string,
};

export default ResidentDropdown;
