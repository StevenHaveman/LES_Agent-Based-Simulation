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

import React from 'react';
import "../styles/ResidentsList.css";

const ResidentsList = ({ residents }) => {
    return (
        <div className="container">
            <h1 className="h1-with-icon">
                Residents
                <img src="/INNO/Residents_icon.png" alt="Residents Icon" className="Residents_icon" />
            </h1>
            {residents && residents.length > 0 ? (
                <ul>
                    {residents.map((resident, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {resident.name} <br />
                            <strong>Income:</strong> {resident.income} <br />
                            <strong>solar_decision:</strong> {resident.solar_decision ? "Yes" : "No"}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No residents available.</p>
            )}
        </div>
    );
};

export default ResidentsList;