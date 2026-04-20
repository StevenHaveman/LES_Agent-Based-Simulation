import React, { useState } from "react";
import "../styles/AIChat.css";
import aiChatController from "../../controller/AIChatController.js";

/**
 * AIChat component provides a chat interface for interacting with an AI system.
 * It allows users to send prompts and receive responses based on the selected resident.
 *
 * @param {Object} props - The component props.
 * @param {Object|null} props.resident - The selected resident object containing their details.
 * @returns {JSX.Element} The rendered AIChat component.
 */
const AIChat = ({ resident }) => {

    // State to manage the current prompt input.
    const [prompt, setPrompt] = useState("");
    // State to manage the list of chat messages.
    const [messages, setMessages] = useState([]);

    /**
     * Renders a hint message if no resident is selected.
     */
    if (!resident) {
        return (
            <div className="select-resident-hint">
                <h3>Click on a Resident</h3>
            </div>
        );
    }

    /**
     * Handles sending a prompt to the AI system.
     * Updates the chat messages with the user's input and the AI's response.
     */
    const handleSend = async () => {
        if (prompt.trim() === "") return;

        const userMessage = { role: "user", content: prompt };
        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");

        // Temporary placeholder for AI response.
        setMessages((prev) => [...prev, { role: "ai", content: "..." }]);

        try {
            // Simulate a delay for the AI response.
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Send the prompt to the AI system and update the messages with the response.
            const result = await aiChatController.sendPrompt(prompt, resident);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: result.response },
            ]);
        } catch (error) {
            // Handle errors by displaying an error message in the chat.
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "ai", content: "Er ging iets mis met de AI." },
            ]);
        }
    };

    /**
     * Handles the Enter key press event in the prompt input field.
     * Sends the prompt if Enter is pressed without the Shift key.
     *
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="conversation-container">
                {/* Render the list of chat messages */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="prompt-container">
                <div className="input-row">
                    {/* Button to start a new chat */}
                    <button
                        className="new-chat-btn"
                        title="Nieuwe chat"
                        onClick={() => setMessages([])}
                    >
                        ＋
                    </button>
                    {/* Textarea for entering the prompt */}
                    <textarea
                        placeholder="Ask a question..."
                        className="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                    {/* Button to send the prompt */}
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