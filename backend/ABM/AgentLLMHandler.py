import ollama
import json
import os
import glob

class AgentLLMHandler:
    def __init__(self, model_name,chosen_config):
        """
        Setup the starting parameters for the class.
        """
        self.model_name = model_name
        self.chosen_config = chosen_config
        self.file_name = self.get_json_file_name()
        self.current_agent_id = 0
        self.current_agent_conversation = []

    def set_current_agent_id(self,agent_id):
        """
        Sets the current agent id
        """
        self.current_agent_id = agent_id

    def get_json_file_name(self):
        """
        Gather the json's file name 
        """
        save_folder = self.chosen_config['data_save_folder']
        os.makedirs(save_folder, exist_ok=True)

        # Find existing files matching the pattern
        existing_files = glob.glob(os.path.join(save_folder, "simulation_data_*.json"))
        run_number = len(existing_files) + 1
        file_name = os.path.join(save_folder, f"simulation_data_{run_number:03d}.json")

        return file_name

    def get_agent_conversation(self):
        """
        Gathers the agent conversation 
        """
        if not os.path.exists(self.file_name):
            raise FileNotFoundError(f"Data file {self.file_name} not found.")

        # Load current JSON data
        with open(self.file_name, 'r') as file:
            data = json.load(file)
        agent_key = f"{self.current_agent_id}"

        self.current_agent_conversation = data["conversation_history"]["residents"][agent_key]

    def update_agent_conversation(self):
        """
        Updates the conversation of the agent in the json file.
        """
        # Read First
        with open(self.file_name, 'r') as file:
            data = json.load(file)

        agent_key = f"{self.current_agent_id}"
        data["conversation_history"]["residents"][agent_key] = self.current_agent_conversation

        # After Write
        with open(self.file_name, 'w') as file:
            json.dump(data, file, indent=4)

    def _get_system_prompt(self):
        """
        First testing prompt to insert in to the model -- not in use right now.
        """
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


    def _get_system_prompt_second_version(self, max_years=5):
        """
        Second prompt that uses the building of score blocks and agent info of the last 'max_years' -- In use.
        """
        if not os.path.exists(self.file_name):
            raise FileNotFoundError(f"Data file {self.file_name} not found.")

        with open(self.file_name, 'r') as file:
            data = json.load(file)

        year_data_list = []

        # Collect all the data of the years for the sellected agent.
        for year_key in data["simulation_years"].keys():
            year_number = int(year_key.split()[-1])
            year_data = data["simulation_years"][year_key]["residents_data"][f"{self.current_agent_id}"]

            if not year_data:
                continue

            attitude = year_data.get("attitude")
            subj_norm = year_data.get("subj_norm", {})
            behavioral_control = year_data.get("behavioral_control", {})

            year_data_list.append((year_number, attitude, subj_norm, behavioral_control))

        # Get the last 'max_years' years, oldest first.
        year_data_list = sorted(year_data_list, key=lambda x: x[0], reverse=True)[:max_years]
        year_data_list = sorted(year_data_list, key=lambda x: x[0]) # Sort again oldes first.

        if not year_data_list:
            return self._get_system_prompt()

        # Build string for every year.
        year_lines = []
        for year, att, sn_dict, bc_dict in year_data_list:
            sn_str = ", ".join(f"{k}: {v:.2f}" for k, v in sn_dict.items())
            bc_str = ", ".join(f"{k}: {v:.2f}" for k, v in bc_dict.items())

            year_lines.append(
                f"(Year {year})\n"
                f"  Attitude: {att:.2f}\n"
                f"  Subjective Norms: {sn_str}\n"
                f"  Perceived Behavioral Control: {bc_str}"
            )

        # Block of scores in strings.
        score_block = "\n".join(year_lines)

        return {
            'role': 'system',
            'content': (
                "You are a resident in a neighborhood and will be asked about your opinion on sustainable energy solutions for your home.\n"
                "This response is based on your internal factors across multiple years, each represented as a score between 0 and 1.\n"
                "These factors follow the Theory of Planned Behavior (Ajzen, 1991):\n"
                "- Attitude: how you think about renewable energy\n"
                "- Subjective Norm: how influenced you are by neighbors\n"
                "- Perceived Behavioral Control: how money affects your decision\n"
                "Your scores over the years:\n"
                f"{score_block}\n"
                "You may reflect on how your thinking and influences changed over time. Please answer any questions within 150 words."
            )
        }

    def _init_conversation(self, agent_id):
        """
        Start the chat and is setting agent id, gathers json info, gets conversation.
        """
        self.set_current_agent_id(agent_id)
        self.get_json_file_name()
        self.get_agent_conversation()
        if len(self.current_agent_conversation) == 0: 
            self.current_agent_conversation = [self._get_system_prompt_second_version()]

    def chat(self, agent_id, prompt):
        """
        Every time a prompt is send in the front end this function will be called to get a response from the llm.
        """
        if not prompt.strip():
            raise ValueError("Prompt is leeg.")

        self._init_conversation(agent_id)

        self.current_agent_conversation.append({'role': 'user', 'content': prompt})

        response = ollama.chat(
            model=self.model_name,
            messages=self.current_agent_conversation
        )

        model_reply = response.message.content
        self.current_agent_conversation.append({'role': 'assistant', 'content': model_reply})

        self.update_agent_conversation()
        return model_reply