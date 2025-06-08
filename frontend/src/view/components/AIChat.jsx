import React from "react";

const AIChat = ({ resident }) => {
    if (!resident) {
        return (
            <div className="select-resident-hint">
                <h3>Click on a Resident</h3>
            </div>
        );
    }

    return (
        <div className="ai-chat-container">
            <h1>AI Chat {resident.name}</h1>
        </div>
    );
};

export default AIChat;