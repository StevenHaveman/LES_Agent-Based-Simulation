import React from 'react';

const ResidentsList = ({ residents }) => {
    return (
        <div>
            <h2>Residents</h2>
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