import React from "react";
import HouseholdDecisions from "./HouseholdDecisions";
import "../styles/HouseholdWindow.css";
import HouseholdInfo from "./HouseholdInfo.jsx";


const HouseholdWindow = ({ window, setWindow, selectedHouseholdId }) => {

    if (!window) {
        return null;
    }


    if (!selectedHouseholdId) {
        return (
            <div className="select-household-hint">
                <h3>Klik op een huishouden</h3>
            </div>
        );
    }

    const renderContent = () => {
        switch (window) {
            case "decision":
                return (
                    <HouseholdDecisions
                        selectedHouseholdId={selectedHouseholdId}
                        visible={true}
                    />
                );
            case "info":
                return (
                   <HouseholdInfo selectedHouseholdId={selectedHouseholdId} visible={true}/>
                );

            default:
                return null;
        }
    };

    return renderContent();
};

export default HouseholdWindow;