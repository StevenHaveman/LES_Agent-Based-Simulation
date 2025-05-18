import React from "react";

import "../styles/ResidentWindow.css";
import "./ResidentInfo.jsx";
import ResidentInfo from "./ResidentInfo.jsx";

const ResidentWindow = ({ residentWindow, residents, selectedResidentIndex }) => {


    const renderContent = () => {
        switch (residentWindow) {
            case "info-resident":
                return (
                    <ResidentInfo
                        resident={residents && selectedResidentIndex !== null ? residents[selectedResidentIndex] : null}
                        visible={true}
                    />
                );
            default:
                return (
                    <div className="select-household-hint">
                        <h3>Click on a resident </h3>
                    </div>
                );
        }
    };

    return renderContent();
};

export default ResidentWindow
