import AIChatService from "../service/AIChatService.js";

/**
 * AIChatController class acts as a mediator between the AIChatService and the frontend components.
 * It provides methods to send prompts to the AI backend service and retrieve responses.
 */
class AIChatController {
    /**
     * Creates an instance of AIChatController.
     *
     * @param {AIChatService} service - The service instance used to interact with the AI backend.
     */
    constructor(service) {
        this.service = service;
    }

    /**
     * Sends a prompt to the AI backend service and retrieves the response.
     *
     * @param {string} prompt - The prompt or question to send to the AI system.
     * @param {number} residentId - The ID of the resident associated with the prompt.
     * @returns {Promise<Object>} The response from the AI backend, containing the AI's reply.
     */
    async sendPrompt(prompt, residentId) {
        return await this.service.sendPrompt(prompt, residentId);
    }
}

// Singleton instance of AIChatController for reuse across the application.
const aiChatController = new AIChatController(AIChatService);
export default aiChatController;