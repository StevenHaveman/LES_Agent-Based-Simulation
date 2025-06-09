import React, { useState } from "react";
import "../styles/AIChat.css";
import aiChatController from "../../controller/AIChatController.js";


const AIChat = ({ resident }) => {

    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);

    if (!resident) {
        return (
            <div className="select-resident-hint">
                <h3>Click on a Resident</h3>
            </div>
        );
    }


    const handleSend = async () => {
        if (prompt.trim() === "") return;


        const userMessage = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");

        setMessages((prev) => [...prev, { role: "ai", content: "..." }]);

        try {

            await new Promise((resolve) => setTimeout(resolve, 3000));


            const result = await aiChatController.sendPrompt(prompt);

            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: result.response },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: "Er ging iets mis met de AI." },
            ]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="conversation-container">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="prompt-container">
                <div className="input-row">
                    <button
                        className="new-chat-btn"
                        title="Nieuwe chat"
                        onClick={() => setMessages([])}
                    >
                        ＋
                    </button>
                    <textarea
                        placeholder="Ask a question..."
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                    <button
                        className="send-btn"
                        title="Verstuur prompt"
                        onClick={handleSend}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;