import ollama
import json
import os
import glob

class AgentLLMHandler:
    def __init__(self, model_name,chosen_config):
        self.model_name = model_name
        self.chosen_config = chosen_config
        self.file_name = self.get_json_file_name()
        self.current_agent_id = 0
        self.current_agent_conversation = []
        # self.conversations = {}  # per agent_id



    def set_current_agent_id(self,agent_id):
        self.current_agent_id = agent_id

    def get_json_file_name(self):
        save_folder = self.chosen_config['data_save_folder']
        os.makedirs(save_folder, exist_ok=True)

        # Find existing files matching the pattern
        existing_files = glob.glob(os.path.join(save_folder, "simulation_data_*.json"))
        run_number = len(existing_files) + 1
        file_name = os.path.join(save_folder, f"simulation_data_{run_number:03d}.json")

        return file_name

    def get_agent_conversation(self):
        if not os.path.exists(self.file_name):
            raise FileNotFoundError(f"Data file {self.file_name} not found.")

        # Load current JSON data
        with open(self.file_name, 'r') as file:
            data = json.load(file)
        agent_key = f"{self.current_agent_id}"

        self.current_agent_conversation = data["conversation_history"]["residents"][agent_key]
        print(self.current_agent_conversation)

    def update_agent_conversation(self):
        # Eerst lezen
        with open(self.file_name, 'r') as file:
            data = json.load(file)

        agent_key = f"{self.current_agent_id}"
        data["conversation_history"]["residents"][agent_key] = self.current_agent_conversation

        # Daarna schrijven
        with open(self.file_name, 'w') as file:
            json.dump(data, file, indent=4)

        print(f"opslaan naar {self.file_name}")

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
            self.set_current_agent_id(agent_id)
            self.get_json_file_name()
            self.get_agent_conversation()
            if len(self.current_agent_conversation) == 0: 
                self.current_agent_conversation = [self._get_system_prompt()]

    def chat(self, agent_id, prompt):
        if not prompt.strip():
            raise ValueError("Prompt is leeg.")

        self._init_conversation(agent_id)

        self.current_agent_conversation.append({'role': 'user', 'content': prompt})
        print(self.current_agent_conversation)

        response = ollama.chat(
            model=self.model_name,
            messages=self.current_agent_conversation
        )

        # print(response)
        # print(model_reply)

        model_reply = response.message.content
        self.current_agent_conversation.append({'role': 'assistant', 'content': model_reply})
        # print(model_reply)

        self.update_agent_conversation()
        return model_reply

    # def reset_conversation(self, agent_id):
    #     self.conversations[agent_id] = [self._get_system_prompt()]

    # def get_history(self, agent_id):
    #     return self.conversations.get(agent_id, [])