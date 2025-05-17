import React from "react";
import "../styles/HouseholdWindow.css";

const HouseholdWindow = ({ onShowContent }) => {
    return (
        <div className="window-container">
            <div className="decisions-tab" onClick={onShowContent}>
                <h4>Decisions</h4>
            </div>
        </div>
    );
};

export default HouseholdWindow;