# LLM Interaction Flowchart & Agent Handler Class Diagram

## 1. Flowchart: LLM with Role Prompt and User Input

This flowchart describes how the LLM operates using a role prompt followed by user input.  
The role is initialized once, and then the user can repeatedly send inputs and receive responses.  
Each exchange is stored in the agent's message history.

### 🧠 Flow Steps:

1. Initialize Role Prompt  
2. LLM internalizes Role Prompt  
3. Wait for User Input  
4. Send User Prompt to LLM  
5. Receive LLM Response  
6. Save User Input & LLM Output  
7. Ask: Does the user want to continue?  
   - If **yes** → loop back to step 3  
   - If **no** → end chat  

> ![Flowchart Image Placeholder](photos/LLM%20flowchart.png)  


---

## 2. Class Diagram: `AgentLLMHandler` System

This class diagram describes how the `AgentLLMHandler` manages sessions with agents and the LLM.  
Each agent keeps track of its role prompt and a full message history.

> ![Class Diagram Placeholder](photos/LLM%20Class.png)  

---

### 🏷️ Class: `AgentLLMHandler`

#### Attributes:
- `model_name`: Name of the LLM model (e.g., `"llama3.1:8b"`).
- `chosen_config`: `dict` containing configuration like the `data_save_folder`.
- `file_name`: Path to the JSON file where conversations are stored.
- `current_agent_id`: ID of the active agent.
- `current_agent_conversation`: `list` storing the ongoing conversation.

#### Public Methods:
- `__init__(model_name, chosen_config)`: Initializes the handler with model and config.
- `set_current_agent_id(agent_id)`: Sets the active agent ID.
- `get_json_file_name()`: Generates or retrieves the file path for saving data.
- `get_agent_conversation()`: Loads existing conversation for the agent from the JSON file.
- `update_agent_conversation()`: Saves current conversation to the JSON file.
- `chat(agent_id, prompt)`: Runs the chat logic for a given prompt and agent.

#### Private Methods:
- `_get_system_prompt()`: Returns a default system message based on TPB values.
- `_get_system_prompt_second_version(max_years=5)`: Constructs a system prompt using multiple years of TPB data.
- `_init_conversation(agent_id)`: Initializes conversation if not started yet.

---

### 🔗 Relationships and Dependencies:

- Uses `ollama.chat()` to interface with the LLM.
- Reads and writes JSON files with Python’s `json` module.
- Interacts with the file system via `os` and `glob`.

---

> For detailed implementation, see the `AgentLLMHandler.py` file.
