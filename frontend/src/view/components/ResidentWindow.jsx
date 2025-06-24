import React from "react";

import "../styles/ResidentWindow.css";
import "./ResidentInfo.jsx";
import ResidentInfo from "./ResidentInfo.jsx";

/**
 * ResidentWindow component dynamically renders content based on the selected resident
 * and the current window state (info-resident or default).
 *
 * @param {Object} props - The component props.
 * @param {string|null} props.residentWindow - The current state of the resident window tab.
 * @param {Array<Object>|null} props.residents - The list of residents available for selection.
 * @param {number|null} props.selectedResidentIndex - The index of the currently selected resident in the residents array.
 * @returns {JSX.Element} The rendered ResidentWindow component.
 */
const ResidentWindow = ({ residentWindow, residents, selectedResidentIndex }) => {

    /**
     * Determines the content to render based on the current residentWindow state.
     * If the state is "info-resident", renders the ResidentInfo component.
     * Otherwise, renders a hint message.
     *
     * @returns {JSX.Element} The content to render.
     */
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
                        <h3> Click on a Resident or Window</h3>
                    </div>
                );
        }
    };

    return renderContent();
};

export default ResidentWindow;