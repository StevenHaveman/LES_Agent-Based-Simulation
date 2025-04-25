import React, { useEffect, useState } from 'react';
import "../styles/HouseholdList.css";

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
            <h1 class="h1-with-icon">
                Households
                <img src="/INNO/House_icon.png" alt="House Icon" class="house_icon" />
            </h1>
            <ul class="household-list-container">
                {households.map((household) => (
                    <li key={household.id}>
                        <h2>{household.name}</h2>
                        <p>{household.address}</p>
                        <button onClick={() => handleViewResidents(household)}>
                            Check Residents
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HouseholdList;