import React, { useEffect, useState } from "react";
import "../styles/HouseholdInfo.css";
import overviewController from "../../controller/OverviewController.js";

/**
 * HouseholdInfo component displays detailed information about a selected household.
 *
 * @param {Object} props - The component props.
 * @param {number} props.selectedHouseholdId - The ID of the currently selected household.
 * @param {boolean} props.visible - Determines whether the component should be visible.
 * @returns {JSX.Element|null} The rendered HouseholdInfo component or null if not visible.
 */
const HouseholdInfo = ({ selectedHouseholdId, visible }) => {
    // State to store the list of households fetched from the controller.
    const [households, setHouseholds] = useState([]);

    /**
     * useEffect hook to fetch household data when the component mounts.
     * Calls the fetch_households method from the overviewController and updates the state.
     */
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

    // If the component is not visible, return null to prevent rendering.
    if (!visible) {
        return null;
    }

    // Find the household matching the selected ID from the fetched households.
    const selectedHousehold = households.find(h => h.id === selectedHouseholdId);

    return (
        <div className="household_info-container">
            {/* Display the name of the selected household, or an empty string if not found */}
            <h3>Naam: {selectedHousehold ? selectedHousehold.name : ""}</h3>
            <h3>Adres: {selectedHousehold ? selectedHousehold.address : ""}</h3>

        </div>
    );
};

export default HouseholdInfo;