import React, { useEffect, useState } from 'react';

const HouseholdList = ({ onSelectResidents }) => {
    const [households, setHouseholds] = useState([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/fetch_households');
                if (!response.ok) {
                    throw new Error('Failed to fetch households');
                }
                const data = await response.json();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };

        fetchHouseholds();
    }, []);

    const handleViewResidents = (household) => {
        onSelectResidents(household.residents);
    };

    return (
        <div>
            <h1>Huishoudens</h1>
            <img src="frontend/public/House_icon.png" alt="House Icon" style={{ width: '50px', height: '50px' }} />
            <ul style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                {households.map((household) => (
                    <li key={household.id}>
                        <h2>{household.name}</h2>
                        <p>{household.address}</p>
                        <button onClick={() => handleViewResidents(household)}>
                            Bekijk bewoners
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HouseholdList;