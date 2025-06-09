import AIChatService from "../service/AIChatService.js";

class AIChatController {
    constructor(service) {
        this.service = service;
    }

    async sendPrompt(prompt) {
        return await this.service.sendPrompt(prompt);
    }
}

const aiChatController = new AIChatController(AIChatService);
export default aiChatController;