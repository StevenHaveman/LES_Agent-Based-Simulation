import ollama
import json
from pathlib import Path

class AgentLLMHandler:
    def __init__(self, model_name, chosen_config):
        """
        Initialize parameters and prepare data file path.
        """
        self.model_name = model_name
        self.chosen_config = chosen_config
        self.file_name = self._get_json_file_name()
        self.current_agent_id = 0
        self.current_agent_conversation = []
        self._cached_data = None
        self._data_dirty = False

    def set_current_agent_id(self, agent_id):
        """
        Sets the current agent ID.
        """
        self.current_agent_id = agent_id

    def _get_json_file_name(self):
        """
        Determines the file name for saving data.
        """
        save_folder = Path(self.chosen_config['data_save_folder'])
        save_folder.mkdir(parents=True, exist_ok=True)

        existing_files = list(save_folder.glob("simulation_data_*.json"))
        run_number = len(existing_files) + 1
        return save_folder / f"simulation_data_{run_number:03d}.json"

    def _load_json(self):
        """
        Loads and caches JSON content.
        """
        if self._cached_data is not None:
            return self._cached_data

        if not self.file_name.exists():
            self._cached_data = {}
            return self._cached_data

        try:
            with self.file_name.open('r') as file:
                self._cached_data = json.load(file)
        except json.JSONDecodeError:
            self._cached_data = {}

        return self._cached_data

    def _save_json(self):
        """
        Writes cached data to disk if marked dirty.
        """
        if self._data_dirty:
            with self.file_name.open('w') as file:
                json.dump(self._cached_data, file, indent=4)
            self._data_dirty = False

    def get_agent_conversation(self):
        """
        Retrieves the conversation for the current agent.
        """
        data = self._load_json()
        self.current_agent_conversation = (
            data.get("conversation_history", {})
                .get("residents", {})
                .get(str(self.current_agent_id), [])
        )

    def update_agent_conversation(self):
        """
        Updates the agent's conversation in memory and writes if changed.
        """
        data = self._load_json()
        agent_key = str(self.current_agent_id)

        if "conversation_history" not in data:
            data["conversation_history"] = {}
        if "residents" not in data["conversation_history"]:
            data["conversation_history"]["residents"] = {}

        if data["conversation_history"]["residents"].get(agent_key) != self.current_agent_conversation:
            data["conversation_history"]["residents"][agent_key] = self.current_agent_conversation
            self._data_dirty = True
            self._save_json()

    def _get_system_prompt(self):
        """
        Default system prompt (not used currently).
        """
        return {
            'role': 'system',
            'content': (
                "You are a resident in a neighborhood and will be asked about your opinion on sustainable energy solutions for your home. "
                "This response is based on three internal factors, each represented as a score between 0 and 1, and weighted accordingly. "
                "The factors are: Attitude (0.8, weight 0.4), Subjective Norm (0.5, weight 0.3), and Perceived Behavioral Control (0.3, weight 0.3). "
                "Feel free to mention motivations, doubts, or social influences. Keep your answer under 150 words."
            )
        }

    def _get_system_prompt_second_version(self, max_years=5):
        """
        System prompt using historical behavior data for the agent.
        """
        data = self._load_json()
        if "simulation_years" not in data:
            return self._get_system_prompt()

        year_data_list = []

        for year_key, year_info in data["simulation_years"].items():
            try:
                year_number = int(year_key.split()[-1])
                resident_data = year_info["residents_data"].get(str(self.current_agent_id), {})
                if not resident_data:
                    continue

                attitude = resident_data.get("attitude", 0.0)
                subj_norm = resident_data.get("subj_norm", {})
                behavioral_control = resident_data.get("behavioral_control", {})
                year_data_list.append((year_number, attitude, subj_norm, behavioral_control))
            except (KeyError, ValueError):
                continue

        year_data_list = sorted(year_data_list, key=lambda x: x[0], reverse=True)[:max_years]
        year_data_list = sorted(year_data_list, key=lambda x: x[0])  # Oldest first

        if not year_data_list:
            return self._get_system_prompt()

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

        score_block = "\n".join(year_lines)

        return {
            'role': 'system',
            'content': (
                "You are a resident in a neighborhood and will be asked about your opinion on sustainable energy solutions for your home.\n"
                "Your answer should reflect how your attitude, social influences, and financial control changed over time.\n"
                "Here is your historical behavior data:\n"
                f"{score_block}\n"
                "Please answer within 150 words."
            )
        }

    def _init_conversation(self, agent_id):
        """
        Initializes the conversation by loading previous history or inserting system prompt.
        """
        self.set_current_agent_id(agent_id)
        self.get_agent_conversation()

        if not self.current_agent_conversation:
            self.current_agent_conversation = [self._get_system_prompt_second_version()]
            self._data_dirty = True
            self._save_json()

    def chat(self, agent_id, prompt):
        """
        Sends a prompt to the LLM and returns the response.
        """
        if not prompt.strip():
            raise ValueError("Prompt is empty.")

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
