import React from "react";
import "../styles/ResidentNavbar.css";

const ResidentNavbar = ({
                            residentWindow,
                            setResidentWindow,
                            setSelectedTab,
                            chatWindow,
                            setChatWindow,
                        }) => {
    const toggleInfoTab = () => {
        if (residentWindow === "info-resident") {
            setResidentWindow(null);
        } else {
            setResidentWindow("info-resident");
        }
    };

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
            <div
                className={`info-tab-resident${residentWindow === "info-resident" ? " selected" : ""}`}
                onClick={toggleInfoTab}
            >
                <h4>Info</h4>
            </div>
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