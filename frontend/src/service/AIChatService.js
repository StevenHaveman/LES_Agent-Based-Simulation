const API_URL = import.meta.env.VITE_API_URL;


/**
 * AIChatService class provides methods to interact with the AI backend service.
 * It sends prompts to the AI system and retrieves responses.
 */
class AIChatService {
    /**
     * Sends a prompt to the AI backend and retrieves the response.
     *
     * @param {string} prompt - The prompt or question to send to the AI system.
     * @param {number} residentId - The ID of the resident associated with the prompt.
     * @returns {Promise<Object>} The response from the AI backend, containing the AI's reply.
     * @throws {Error} If the response from the backend is not successful.
     */
    async sendPrompt(prompt, residentId) {
        const response = await fetch(`${API_URL}/AI_response`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                resident_id: residentId, // Sends the resident ID along with the prompt
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch AI response");
        }

        return await response.json(); // Contains: { response: "..." }
    }
}

const aiChatService = new AIChatService();
export default aiChatService;