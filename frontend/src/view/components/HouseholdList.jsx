import React, { useEffect, useState } from 'react';
import "../styles/HouseholdList.css";
import "../styles/SharedListStyles.css";
import overviewController from "../../controller/OverviewController.js";


/**
 * Component that displays a list of households.
 * Allows the user to select a household and view its residents.
 *
 * Props:
 * - onSelectResidents: function to pass selected residents to the parent component
 * - onSelectHousehold: function to pass the selected household to the parent component
 * - selectedHouseholdId: ID of the currently selected household (used for visual highlighting)
 */
const HouseholdList = ({ onSelectResidents, onSelectHousehold, selectedHouseholdId }) => {
    const [households, setHouseholds] = useState([]); // Stores the list of households

    // Fetch households from the backend when the component mounts
    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await overviewController.fetch_households();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };
        fetchHouseholds();
    }, []);

    // Handle the selection of a household (user clicks on a list item)
    const handleViewResidents = (household) => {
        onSelectResidents(household.residents);
        onSelectHousehold(household);
    };

    return (
        <div className="container">
            <div className="list">
                <ul className="household-list-container">
                    {households.map((household) => (
                        <li
                            key={household.id}
                            className={`list-item ${selectedHouseholdId === household.id ? 'selected' : ''}`}
                            onClick={() => handleViewResidents(household)}
                        >
                            <div className="entry">
                                {/* Display household icon and name */}
                                <img src="/INNO/Household_icon.png" alt="House icon" className="icon"/>
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