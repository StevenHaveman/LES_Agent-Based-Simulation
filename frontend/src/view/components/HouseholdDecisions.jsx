import React, { useEffect, useState } from "react";
import "../styles/HouseholdDecisions.css";
import overviewController from "../../controller/OverviewController.js";

/**
 * HouseholdDecisions component displays decisions made by residents of a selected household
 * regarding sustainability measures such as solar panels and heat pumps.
 *
 * @param {Object} props - The component props.
 * @param {number} props.selectedHouseholdId - The ID of the currently selected household.
 * @param {boolean} props.visible - Determines whether the component should be visible.
 * @returns {JSX.Element|null} The rendered HouseholdDecisions component or null if not visible.
 */
const HouseholdDecisions = ({ selectedHouseholdId, visible }) => {
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

    /**
     * Determines whether any resident in the selected household has made a decision
     * to install solar panels.
     * @type {boolean}
     */
    const hasSolarDecision = selectedHousehold
        ? selectedHousehold.residents.some(resident => resident["Solar Panel_decision"] === true)
        : false;

    /**
     * Determines whether any resident in the selected household has made a decision
     * to install heat pumps.
     * @type {boolean}
     */
    const hasHeatPumpDecision = selectedHousehold
        ? selectedHousehold.residents.some(resident => resident["Heat Pump_decision"] === true)
        : false;

    return (
        <div className="household-decisions-container">
            {/* Solar panels decision section */}
            <div className="solar-panels">
                <img src="/INNO/solar_panel.png" alt="Solar Panel" className="solar_panel_icon" />
                <h2 className={hasSolarDecision ? "text-green" : "text-red"}>
                    {hasSolarDecision ? "Yes" : "No"}
                </h2>
            </div>
            {/* Heat pumps decision section */}
            <div className="heat-pumps">
                <img src="/INNO/heat_pump.png" alt="Heat Pump" className="heat_pump_icon" />
                <h2 className={hasHeatPumpDecision ? "text-green" : "text-red"}>
                    {hasHeatPumpDecision ? "Yes" : "No"}
                </h2>
            </div>
        </div>
    );
};

export default HouseholdDecisions;