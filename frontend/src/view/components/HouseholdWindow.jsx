import React from "react";
import HouseholdDecisions from "./HouseholdDecisions";
import "../styles/HouseholdWindow.css";
import HouseholdInfo from "./HouseholdInfo.jsx";

/**
 * HouseholdWindow component dynamically renders content based on the selected household
 * and the current window state (decision or info).
 *
 * @param {Object} props - The component props.
 * @param {string|null} props.householdWindow - The current state of the household window tab.
 * @param {number|null} props.selectedHouseholdId - The ID of the currently selected household.
 * @returns {JSX.Element} The rendered HouseholdWindow component.
 */
const HouseholdWindow = ({ householdWindow, selectedHouseholdId }) => {

    /**
     * Renders a hint message if no household is selected.
     */
    if (!selectedHouseholdId) {
        return (
            <div className="select-household-hint">
                <h3> Click on a Household or Window</h3>
            </div>
        );
    }

    /**
     * Determines the content to render based on the current householdWindow state.
     * If the state is "decision", renders the HouseholdDecisions component.
     * If the state is "info", renders the HouseholdInfo component.
     * Otherwise, renders a hint message.
     *
     * @returns {JSX.Element} The content to render.
     */
    const renderContent = () => {
        switch (householdWindow) {
            case "decision":
                return (
                    <HouseholdDecisions
                        selectedHouseholdId={selectedHouseholdId}
                        visible={true}
                    />
                );
            case "info":
                return (
                    <HouseholdInfo
                        selectedHouseholdId={selectedHouseholdId}
                        visible={true}
                    />
                );
            default:
                return (
                    <div className="select-household-hint">
                        <h3> Click on a Household or Window </h3>
                    </div>
                );
        }
    };

    return renderContent();
};

export default HouseholdWindow;