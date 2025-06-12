import ollama

class AgentLLMHandler:
    def __init__(self, model_name="llama3:8b"):
        self.model_name = model_name
        self.conversations = {}  # per agent_id

    def _get_system_prompt(self):
        return {
            'role': 'system',
            'content': (
                "You are a resident in a neighborhood and will be asked about your opinion on sustainable energy solutions for your home. "
                "This response is based on three internal factors, each represented as a score between 0 and 1, and weighted accordingly (the weights sum up to 1). "
                "The internal factors are based on the Theory of Planned Behavior (Ajzen, 1991): "
                "Attitude: 0.8 (weight: 0.4) how you think about your view on renewable energy, "
                "Subjective Norm: 0.5 (weight: 0.3) is about your neighbors, "
                "Perceived Behavioral Control: 0.3 (weight: 0.3) is about money. "
                "Feel free to mention your motivations, doubts, or social influences. "
                "Please answer the questions within 150 words."
            )
        }

    def _init_conversation(self, agent_id):
        if agent_id not in self.conversations:
            self.conversations[agent_id] = [self._get_system_prompt()]

    def chat(self, agent_id, prompt):
        if not prompt.strip():
            raise ValueError("Prompt is leeg.")

        self._init_conversation(agent_id)

        self.conversations[agent_id].append({'role': 'user', 'content': prompt})

        response = ollama.chat(
            model=self.model_name,
            messages=self.conversations[agent_id]
        )

        model_reply = response.message.content
        self.conversations[agent_id].append({'role': 'assistant', 'content': model_reply})
        return model_reply

    def reset_conversation(self, agent_id):
        self.conversations[agent_id] = [self._get_system_prompt()]

    def get_history(self, agent_id):
        return self.conversations.get(agent_id, [])