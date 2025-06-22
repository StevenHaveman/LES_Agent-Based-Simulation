import AIChatService from "../service/AIChatService.js";

class AIChatController {
    constructor(service) {
        this.service = service;
    }

    async sendPrompt(prompt, residentId) {
        return await this.service.sendPrompt(prompt, residentId);
    }
}

const aiChatController = new AIChatController(AIChatService);
export default aiChatController;