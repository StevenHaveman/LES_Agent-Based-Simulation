import React from "react";
import "../styles/ResidentNavbar.css";

/**
 * ResidentNavbar component renders a navigation bar for residents, allowing toggling
 * between an information tab and an AI chat tab.
 *
 * @param {Object} props - The component props.
 * @param {string|null} props.residentWindow - The current state of the resident window tab.
 * @param {Function} props.setResidentWindow - Function to update the resident window state.
 * @param {Function} props.setSelectedTab - Function to update the selected tab state.
 * @param {string|null} props.chatWindow - The current state of the chat window tab.
 * @param {Function} props.setChatWindow - Function to update the chat window state.
 * @returns {JSX.Element} The rendered ResidentNavbar component.
 */
const ResidentNavbar = ({
                            residentWindow,
                            setResidentWindow,
                            setSelectedTab,
                            chatWindow,
                            setChatWindow,
                        }) => {
    /**
     * Toggles the resident information tab. If the tab is already open, it closes it;
     * otherwise, it opens the tab.
     */
    const toggleInfoTab = () => {
        if (residentWindow === "info-resident") {
            setResidentWindow(null);
        } else {
            setResidentWindow("info-resident");
        }
    };

    /**
     * Toggles the AI chat tab. If the tab is already open, it closes it;
     * otherwise, it opens the tab and sets it as the selected tab.
     */
    const toggleAiTab = () => {
        if (chatWindow === "ai") {
            setChatWindow("");
            setSelectedTab(null);
        } else {
            setChatWindow("ai");
            setSelectedTab("ai");
        }
    };

    return (
        <div className="navbar-container-resident">
            {/* Info tab button */}
            <div
                className={`info-tab-resident${residentWindow === "info-resident" ? " selected" : ""}`}
                onClick={toggleInfoTab}
            >
                <h4>Info</h4>
            </div>
            {/* AI chat tab button */}
            <div
                className={`AI-chat-resident${chatWindow === "ai" ? " selected" : ""}`}
                onClick={toggleAiTab}
            >
                <h4>AI-Chat</h4>
            </div>
        </div>
    );
};

export default ResidentNavbar;