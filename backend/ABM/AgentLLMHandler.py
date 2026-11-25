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
        Creates a system prompt containing the resident's historical behavioural data.

        The prompt summarizes the resident's psychological state over the most
        recent simulation years based on the RAA (Reasoned Action Approach) model.

        Included behavioural components:
        - Attitude towards sustainable renovation
        - Perceived social norm
        - Perceived behavioural control (PBC)
        - Behavioural intention
        - Previous renovation decisions

        The historical data is translated into natural language context so the LLM
        can respond as the simulated resident while maintaining behavioural
        consistency over time.
        """

        data = self._load_json()

        if "simulation_years" not in data:
            return self._get_system_prompt()

        history = []

        # Collect historical data for the current resident
        for year_key, year_info in data["simulation_years"].items():

            try:
                year_number = int(year_key.split()[-1])

                resident_data = (
                    year_info["residents_data"]
                    .get(str(self.current_agent_id))
                )

                if resident_data is None:
                    continue

                history.append({
                    "year": year_number,

                    # RAA variables
                    "attitude": resident_data.get("attitude", 0.0),
                    "perceived_norm": resident_data.get("perceived_norm", 0.0),
                    "survey_pbc": resident_data.get("survey_pbc", 0.0),
                    "intention": resident_data.get("intention", 0.0),
                    "intention_threshold": resident_data.get("intention_threshold", 0.7),

                    # Behavioural outcome
                    "wants_to_renovate": resident_data.get("wants_to_renovate", False),

                    # Resident profile
                    "action_score": resident_data.get("action_score", 0.0),
                    "cluster_type": resident_data.get("cluster_type", "Unknown"),
                })

            except (KeyError, ValueError):
                continue


        # Keep only the most recent years
        history = sorted(
            history,
            key=lambda x: x["year"],
            reverse=True
        )[:max_years]

        # Restore chronological order
        history.reverse()


        if not history:
            return self._get_system_prompt()


        history_lines = []

        for entry in history:

            history_lines.append(
                f"(Year {entry['year']})\n"
                f"  Attitude towards sustainability: "
                f"{entry['attitude']:.2f}\n"
                f"  Perceived Social Norm: "
                f"{entry['perceived_norm']:.2f}\n"
                f"  Perceived Behavioural Control: "
                f"{entry['survey_pbc']:.2f}\n"
                f"  Behavioural Intention: "
                f"{entry['intention']:.2f}\n"
                f"  Renovation threshold: "
                f"{entry['intention_threshold']:.2f}\n"
                f"  Wanted to renovate: "
                f"{entry['wants_to_renovate']}\n"
                f"  Action score: "
                f"{entry['action_score']:.2f}"
            )


        history_block = "\n\n".join(history_lines)

        # Latest cluster type represents current resident profile
        cluster = history[-1]["cluster_type"]


        return {
            "role": "system",
            "content": (

                "You are a resident living in a Dutch neighbourhood. "
                "You participate in a simulation about household sustainability "
                "and renovation decisions.\n\n"

                f"You belong to the '{cluster}' behavioural cluster.\n\n"

                "Your responses should represent this resident's personal "
                "opinion and remain consistent with their historical behaviour.\n\n"

                "Consider the following behavioural factors:\n"
                "- Attitude towards sustainable renovation.\n"
                "- Perceived social norm from neighbours and surroundings.\n"
                "- Perceived behavioural control, such as financial and practical "
                "ability.\n"
                "- Behavioural intention and previous renovation decisions.\n\n"

                "Historical behavioural development:\n"
                f"{history_block}\n\n"

                "Answer as if you are this resident. "
                "Do not mention numerical scores or simulation variables. "
                "Translate the behavioural information into realistic opinions, "
                "motivations, concerns and personal reasoning.\n"

                "Keep your answer below 150 words."
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
