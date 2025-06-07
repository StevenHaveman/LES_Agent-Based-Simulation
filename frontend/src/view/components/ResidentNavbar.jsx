import React, { useState } from "react";
import "../styles/ResidentNavbar.css";

const ResidentNavbar = ({ residentWindow, setResidentWindow }) => {
    const [selectedTab, setSelectedTab] = useState(null);

    const toggleInfoTab = () => {
        if (residentWindow === "info-resident") {
            setResidentWindow(null);
        } else {
            setResidentWindow("info-resident");
            setSelectedTab(null); // deselect AI tab
        }
    };

    const toggleAiTab = () => {
        if (selectedTab === "ai") {
            setSelectedTab(null);
        } else {
            setSelectedTab("ai");
            setResidentWindow(null); // deselect info tab
        }
    };

    return (
        <div className="navbar-container-resident">
            <div
                className={`info-tab-resident${residentWindow === "info-resident" ? " selected" : ""}`}
                onClick={toggleInfoTab}
            >
                <h4>Info</h4>
            </div>
            <div
                className={`AI-chat-resident${selectedTab === "ai" ? " selected" : ""}`}
                onClick={toggleAiTab}
            >
                <h4>AI-Chat</h4>
            </div>
        </div>
    );
};

export default ResidentNavbar;