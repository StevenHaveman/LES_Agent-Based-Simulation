/**
 * Component to display a list of residents.
 *
 * Props:
 * @param {Array} residents - An array of resident objects to display.
 * Each resident object should have the following properties:
 * - {string} name - The name of the resident.
 * - {number} income - The income of the resident.
 * - {boolean} solar_decision - The decision of the resident regarding solar panels.
 *
 * Returns:
 * A React component that displays a list of residents or a message if no residents are available.
 */


import "../styles/ResidentsList.css";
import React, { useState } from 'react';
const ResidentsList = ({ residents }) => {
    const [selectedResidentIndex, setSelectedResidentIndex] = useState(null);

    const handleResidentClick = (resident, index) => {
        console.log(`Resident clicked: ${resident.name}`);
        setSelectedResidentIndex(index); // update the selected resident
    };

    return (
        <div className="container">
            <div className="list">
                <ul className="resident-list-container">
                    {residents && residents.length > 0 ? (
                        residents.map((resident, index) => (
                            <li
                                key={index}
                                className={`resident-list-item ${selectedResidentIndex === index ? 'selected' : ''}`}
                                onClick={() => handleResidentClick(resident, index)}
                            >
                                <div className="resident-entry">
                                    <img src="/INNO/Resident_icon.png" alt="Resident icon" className="resident_icon" />
                                    <h2>{resident.name}</h2>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No residents available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ResidentsList;