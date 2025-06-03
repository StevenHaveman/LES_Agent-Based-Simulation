import "../styles/ResidentDropdown.css";
import "../styles/SharedListStyles.css";
import React, { useState } from 'react';

const ResidentDropdown = ({ residents, selectedResidentIndex, onSelectResident }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleResidentClick = (resident, index) => {
        onSelectResident(index);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-container">
            <div className="dropdown">
                <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {residents[selectedResidentIndex]?.name || "Select Resident..."} ▼
                </button>
                {isOpen && (
                    <ul className="dropdown-menu">
                        {residents && residents.length > 0 ? (
                            residents.map((resident, index) => (
                                <li key={index} onClick={() => handleResidentClick(resident, index)}>
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

export default ResidentDropdown;