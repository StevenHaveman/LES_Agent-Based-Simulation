import React from 'react';
import "../styles/ResidentsList.css";

const ResidentsList = ({ residents }) => {
    return (
        <div className="container">
            <h1 class="h1-with-icon">
                Residents
                <img src="/INNO/Residents_icon.png" alt="Residents Icon" class="Residents_icon" />
            </h1>
            {residents && residents.length > 0 ? (
                <ul>
                    {residents.map((resident, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {resident.name} <br />
                            <strong>Income:</strong> {resident.income} <br />
                            <strong>solar_decision:</strong> {resident.solar_decision}
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