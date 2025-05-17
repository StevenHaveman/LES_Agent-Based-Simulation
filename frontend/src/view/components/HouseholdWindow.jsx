import React from "react";
import HouseholdDecisions from "./HouseholdDecisions";

const HouseholdWindow = ({ window, setWindow, selectedHouseholdId }) => {
    const renderContent = () => {
        switch (window) {
            case "decision":
                return <HouseholdDecisions selectedHouseholdId={selectedHouseholdId} visible={true} />;

            default:
                return null;
        }
    };

    return (
            renderContent()
    );
};

export default HouseholdWindow;