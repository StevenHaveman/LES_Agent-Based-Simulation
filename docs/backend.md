# Backend

## 🗂️ Project Structure & File Descriptions
This backend supports an agent-based simulation system designed to model household decision-making (e.g., around sustainability). Below is a breakdown of the project structure, including what each module does.

```
Backend/
├── ABM/                         # Core agent-based model logic (model, schedule, data collection)
├── Agents/                      # Contains agent definitions (Household, Resident)
│   ├── household_agent.py
│   └── resident_agent.py
├── AgentLLMHandler.py           # Handles interaction between agents and a language model (LLM)
├── app.py                       # Flask app: defines the REST API and routes
├── config.py                    # Stores and manages simulation configuration parameters
├── enviroment.py                # Sets up the simulation environment (space, topology)
├── main.py                      # Orchestrates the simulation: runs, resets, and returns results
├── shared_state.py              # Stores global shared state like pause/delay flags
├── test_mvp.py                  # Simple test script for core simulation features
├── utillitie.py                 # Helper functions (e.g., config selection, formatting)
```

## 📄 Module Descriptions
Contains the model definition itself, including the Mesa model class and possibly data collection, step logic, and scheduling. This is the simulation’s engine.

### Agents/

#### household_agent.py
This file defines the ```Household``` class, a ```Mesa Agent``` representing a household unit within the agent-based sustainability simulation. A household contains multiple ```Resident``` agents (created via ```create_residents```) and collectively decides whether to adopt sustainability packages (like solar panels or heat pumps) based on residents’ individual decisions.

Key features and methods:

Attributes:
- **residents:** a list of associated Resident agents.
- **package_installations:** tracks which sustainability packages have been installed.
- **solarpanel_amount, energy_generation, gas_usage, energy_usage, heatpump_usage:** energy-related attributes sampled from config.
- **skip_prev_flags and skip_next_flags:** used for modeling direct social influence from neighboring households.
- **create_residents(nr_residents, id_counter):** Instantiates Resident agents and associates them with this household, inheriting package installation status.
- **calc_avg_decision(package):** Aggregates resident decisions for a given package and installs it if the fraction of approving residents meets the household’s threshold (household_decision_threshold). Reduces the model's CO₂ count accordingly.
- **calc_co2_emissions():** Calculates household CO₂ emissions based on electricity and gas usage.
- **step():** Performs a simulation step by calling step() on all residents and re-evaluating household-level package adoption. Also accumulates yearly CO₂ savings from installed packages.
- **__str__():** Returns a formatted string summary of the household's ID, package installation statuses, and resident decisions.

This agent is central in modeling group decision-making and environmental impact at the household level within the simulation.

#### resident_agent.py
This file defines the **Resident** class, a **Mesa Agent** that models an individual within a household. Each resident evaluates sustainability packages based on a behavioral decision model incorporating attitude, subjective norms, and perceived behavioral control. These individual decisions feed into collective household adoption behavior.

Key features and methods:

Attributes:
- **income:** Calculated via a log-normal distribution (calc_salary()), reflecting Dutch income distribution.
attitude, subj_norm, behavioral_control: Core psychological components influencing sustainability decisions.
- **package_decisions:** Stores per-package adoption decisions (True or False).
- **decision_threshold:** Determines the required decision score for adoption.
Modifiers (attitude_mod, subj_norm_mod, behavioral_mod): Adjust each factor's influence on decision-making.
- **calc_salary():** Generates income using a log-normal distribution based on config parameters (median_income, sigma_normal).
- **calc_behavioral_control():** Calculates per-package feasibility based on resident income and household context via the package's own behavioral influence function.
- **calc_subjective_norm():** Retrieves or updates perceived social pressure per package from the environment or previous state.
- **calc_decision():** Computes a decision score for each not-yet-adopted sustainability package using:
```
decision_stat = (attitude * mod + subjective_norm * mod + behavioral_control * mod) / 6
```
If this score exceeds the decision_threshold, the resident adopts the package.
- **collect_resident_data():** Gathers internal state data (e.g., income, attitude, adoption decisions) into a dictionary for logging or analysis.
- **step():** Simulation step logic. Triggers decision-making (calc_decision()), applies a random raise to income, and re-evaluates behavioral control and norms.
This agent models the micro-level dynamics of sustainability decisions, supporting the simulation’s broader goal of understanding household and community adoption patterns.

### AgentLLMHandler.py

This module defines the AgentLLMHandler class, responsible for managing conversations between a resident agent and a local LLM (e.g., via Ollama). It handles prompt generation, conversation memory, and reading/writing data to JSON for persistence across simulation steps.

**Class:** AgentLLMHandler
Handles communication with a language model for simulating resident opinions on sustainability.

**Constructor**
```
def __init__(self, model_name, chosen_config)
```
- Initializes model name and config.
- Sets up file path for conversation data (auto-increments per run).
- Prepares cache variables and state flags.

**Key Methods**
**Agent ID & File Setup**
- **set_current_agent_id(agent_id):** Sets which resident is currently being queried.
- **_get_json_file_name():** Generates a file name like simulation_data_001.json, creating the data folder if needed.

**JSON Caching & Saving**
- **_load_json():** Loads JSON once and caches it to reduce disk reads.
- **_save_json():** Writes back only if _data_dirty flag is True.

**Conversation Management**
- **get_agent_conversation():** Loads the existing chat history for the current agent.
- **update_agent_conversation():** Updates the JSON if the current conversation has changed.

**Prompt Generation**
- **_get_system_prompt():** Returns a static system prompt with current values for attitude, norms, and control.
- **_get_system_prompt_second_version(max_years=5):** Builds a time-series-based prompt using historic simulation values per year for the current agent. Returns fallback if no data available.

**Conversation Initialization**
```
def _init_conversation(agent_id)
```
- Loads past history for a given agent or initializes a new conversation using a system prompt (preferably with historic data).

**Chat with the LLM**
```
def chat(agent_id, prompt)
```
- Initializes conversation if necessary.

- Appends the user prompt and sends it to the model using ollama.chat(...).

- Receives the assistant's response, stores it, and updates the JSON data.

**Behavior Summary**
- Uses structured JSON files to store:
- - Per-agent conversation history.
- - Yearly simulation data (attitude, norms, control).
- Adjusts prompts dynamically based on agent history.
- Allows querying an LLM to simulate nuanced agent responses.

This class enables more human-like simulation of resident behavior by interfacing simulation data with a local language model and managing persistent memory per agent.




### app.py
This module sets up the Flask application that serves as the backend API for controlling and interacting with the agent-based simulation. It handles simulation lifecycle, data exchange, and integration with a local LLM (via AgentLLMHandler).

**Main Purpose:**
Provide API endpoints to run simulations, access aggregated data, query simulated agents using LLMs, and dynamically update simulation parameters.

**Core setup**
```
app = Flask(__name__)
```
- Initializes the Flask app.
- Configures CORS to allow frontend access (localhost:5173).
- Chooses a configuration and initializes an AgentLLMHandler instance.

**Key Endpoints**
**Simulation Control**
- **/simulation POST:** Starts a new simulation with parameters like number of households, residents, simulation years, and seed.
- **/toggle_pause POST:** Pauses or resumes the simulation (toggles a global shared state).
- **/pause_status GET:** Returns whether the simulation is currently paused.
- **/set_delay POST:** Sets the simulation delay between steps (useful for pacing real-time animations).
- **/get_delay GET:** Retrieves the currently configured delay.

**Data Access**
- **/graphics_data GET:** Returns yearly aggregated statistics suitable for plotting (e.g., adoption rates).
- **/households GET:** Returns detailed household and resident data from the last simulation run.

**Agent-LLM Interaction**
**/AI_response POST:** Sends a user prompt to a specific resident agent, using the AgentLLMHandler to simulate a response via LLM.
**Example body:**
```
{
"role": "system",
"content": "Why did you install solar panels?",
}
```

**Configuration Management**
- **/get_config GET:** Returns the currently selected simulation config (households, residents, seed, etc.).
- **/update_parameter POST:** Updates a single config parameter (e.g., simulation_years).
- **/get_full_config_values GET:** Returns the full config dictionary, including internal parameters.
- **/parameters GET:** Alias for getting the active config.
- **/config GET:** Returns the initially chosen config (used by frontend to initialize sliders, etc.).

**Integrated Modules**
- **main.py:** Provides the run_simulation function and tracks global data (graphics_data, households_data).
- **AgentLLMHandler.py:** Manages AI communication with resident agents.
- **shared_state.py:** Controls simulation pause state and delay timing.
- **utilities.py:** Provides config loading and selection utilities.
- **config.py:** Stores and manages simulation configuration presets.

**Behavior Summary**
- Responds to frontend inputs by launching and managing simulations.
- Exposes simulation results and agent data through a clean REST API.
- Bridges the agent simulation with a conversational AI to simulate realistic agent reasoning.
- Supports runtime configurability and pause/resume interactivity for step-wise or animated simulations.

This API layer enables interactive experimentation with agent-based simulations of household decision-making in the context of sustainability adoption.

### config.py

### enviroment.py

### main.py

### shared_state.py

### test_mvp.py

### utillities.py