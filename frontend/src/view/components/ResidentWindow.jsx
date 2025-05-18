import React from "react";

import "../styles/ResidentWindow.css";
import "./ResidentInfo.jsx";
import ResidentInfo from "./ResidentInfo.jsx";

const ResidentWindow = ({ residentWindow, residents, selectedResidentIndex }) => {
    if (!residentWindow) return null;

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
                return null;
        }
    };

    return renderContent();
};

export default ResidentWindow
