/**
 * Component to display a list of households.
 *
 * Props:
 * @param {Function} onSelectResidents - Callback function to handle the selection of residents from a household.
 *
 * State:
 * @property {Array} households - An array of household objects fetched from the backend.
 * Each household object should have the following properties:
 * - {number} id - The unique identifier of the household.
 * - {string} name - The name of the household.
 * - {string} address - The address of the household.
 * - {Array} residents - An array of resident objects belonging to the household.
 *
 * Returns:
 * A React component that displays a list of households and allows viewing their residents.
 */

import React, {useEffect, useState} from 'react';
import "../styles/HouseholdList.css";

const HouseholdList = ({onSelectResidents}) => {
    const [households, setHouseholds] = useState([]);
    const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);

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
        setSelectedHouseholdId(household.id);
        onSelectResidents(household.residents);
    };

    return (
        <div className="container">
            <div className="list">
                <ul className="household-list-container">
                    {households.map((household) => (
                        <li
                            key={household.id}
                            className={`household-list-item ${selectedHouseholdId === household.id ? 'selected' : ''}`}
                            onClick={() => handleViewResidents(household)}
                        >
                            <div className="household-entry">
                                <img src="/INNO/House_icon.png" alt="House icon" className="house_icon"/>
                                <h2>{household.name}</h2>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default HouseholdList;