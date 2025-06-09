import React, { useState } from "react";
import "../styles/AIChat.css";

const AIChat = ({ resident }) => {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (prompt.trim() === "") return;

        setMessages((prev) => [...prev, { role: "user", content: prompt }]);
        setPrompt("");
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
                    <button className="new-chat-btn" title="Nieuwe chat" onClick={() => setMessages([])}>＋</button>
                    <textarea
                        placeholder="Typ hier je prompt..."
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                    <button className="send-btn" title="Verstuur prompt" onClick={handleSend}>➤</button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;