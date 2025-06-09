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
                <div className="input-row">
                    <button className="new-chat-btn" title="Nieuwe chat">＋</button>
                    <textarea
                        placeholder="Typ hier je prompt..."
                        className="prompt-input"
                    ></textarea>
                    <button className="send-btn" title="Verstuur prompt">➤</button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;