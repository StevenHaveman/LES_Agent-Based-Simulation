import AIChatService from '../services/AIChatService';

export function useAIChat() {

    const sendPrompt = async (prompt, residentId) => {
        return await AIChatService.sendPrompt(prompt, residentId);
    };

    return { sendPrompt };
}
