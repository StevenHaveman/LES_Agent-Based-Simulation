import React from "react";
import HouseholdDecisions from "./HouseholdDecisions";
import "../styles/HouseholdWindow.css";
import HouseholdInfo from "./HouseholdInfo.jsx";

const HouseholdWindow = ({ householdWindow, selectedHouseholdId }) => {

    if (!selectedHouseholdId) {
        return (
            <div className="select-household-hint">
                <h3> Select a household</h3>
            </div>
        );
    }

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
                        <h3>Click on a household </h3>
                    </div>
                );

        }
    };


    return renderContent();
};

export default HouseholdWindow;