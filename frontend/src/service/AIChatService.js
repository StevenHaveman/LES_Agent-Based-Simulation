const API_URL = "http://127.0.0.1:5000";

class AIChatService {
    async sendPrompt(prompt, residentId) {
        const response = await fetch(`${API_URL}/AI_test_response`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                resident_id: residentId,  // Stuur resident ID mee
            }),
        });

        if (!response.ok) {
            throw new Error("AI-response ophalen mislukt");
        }

        return await response.json(); // bevat: { response: "..." }
    }
}

const aiChatService = new AIChatService();
export default aiChatService;
