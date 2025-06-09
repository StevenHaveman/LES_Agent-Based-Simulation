
import "../styles/AIChatWindow.css";
import React from "react";
import AIChat from "./AIChat.jsx";


const AIChatWindow = ({chatWindow, residents, selectedResidentIndex }) => {

    const renderContent = () => {
        switch (chatWindow) {
            case "ai":
                return (
                    <AIChat  resident={residents && selectedResidentIndex !== null ? residents[selectedResidentIndex] : null}
                             visible={true}> </AIChat>

                );
            default:
                return (
                    <AIChat  resident={residents && selectedResidentIndex !== null ? residents[selectedResidentIndex] : null}
                             visible={true}> </AIChat>
                );
        }
    };

    return renderContent();
};


export default AIChatWindow;