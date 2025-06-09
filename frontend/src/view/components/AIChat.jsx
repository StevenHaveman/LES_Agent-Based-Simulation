import React from "react";
import "../styles/AIChat.css";

const AIChat = ({ resident }) => {
    // if (!resident) {
    //     return (
    //         <div className="select-resident-hint">
    //             <h3>Click on a Resident</h3>
    //         </div>
    //     );
    // }

    return (
        <div className="ai-chat-container">
            <div className="conversation-container"> conversation-container</div>
            <div className="prompt-container">
                prompt-container

            </div>
        </div>
    );
};

export default AIChat;