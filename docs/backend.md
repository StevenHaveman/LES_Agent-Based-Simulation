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
This module defines configurable simulation parameters used across the sustainability adoption model. It contains multiple predefined configurations (e.g., for testing or real-world approximation), allowing easy switching between setups by adjusting the CHOSEN_CONFIG variable.

**Global Variable**
```
CHOSEN_CONFIG = 1
```
- Determines which configuration dictionary (e.g., configs[1]) is used during simulation runs.

**configs**  
A dictionary of numbered simulation configurations. Each config defines all key parameters for residents, households, environment, and simulation data collection.

**Config 1 – Full-Scale Realistic Testing Setup**
This is the main testing configuration (CHOSEN_CONFIG = 1). It simulates a full neighborhood based on realistic Dutch data (2024). It supports 30 years of adoption behavior, environmental pricing, and includes probabilistic adoption chances.

**Simulation Startup**
- **nr_households:** 840 — Approximate number of households based on CBS statistics.
- **nr_residents:** 1772 — Based on average Dutch household size (2.1).
- **simulation_years:** 30 — Long-term simulation to analyze adoption trends over decades.
- **seed:** Random seed initialization for reproducibility.

**Environment Parameters**
- **subjective_norm:** 0.0 — Initial social influence, modifiable during simulation.
- **solar_panel_price:** €410 — Initial cost of solar panels.
- **heat_pump_price:** €6000 — Realistic average installation cost.
- **energy_price:** €0.32/kWh — Based on Dutch electricity prices (2024).
- **gas_price:** €1.29/m³ — Market average for gas in the Netherlands.
- **yearly_energy_usage:** (1600, 5000) — Range of household energy needs (kWh).
- **yearly_gas_usage:** (900, 1900) — Range of gas consumption per year (m³).
- **CO2_electricity:** 0.27 kg/kWh — Emissions from electricity.
- **CO2_gas:** 1.78 kg/m³ — Emissions from gas usage.
- **yearly_heatpump_usage:** (2000, 2500) kWh — Electricity usage of a typical heat pump.
- **initial_solarpanel_chance:** 32% — Adoption rate at simulation start.
- **initial_heatpump_chance:** 7% — Based on CBS adoption estimates.
- **solarpanel_price_increase:** (0, 20) €/year — Random yearly cost changes.
- **heatpump_price_increase:** (0, 300) €/year — Variable price trajectory.
- **min_nr_houses:** 20, max_nr_houses: 60 — Determines street/district size for norm calculation.
- **subj_norm_level:** "Street" — Social influence is calculated at the street level.

**Household Agent Parameters**
- **solar_panel_amount_options:** [6, 8, 10] — Choices for panel installations.
- **energy_generation_range:** (298, 425) kWh — Per panel annual output.
- **household_decision_threshold:** 0.5 — At least 50% of residents must agree to adopt.

**Resident Agent Parameters**
- **median_income:** €3300/month — Median Dutch income (2024).
- **sigma_normal:** €700 — Income standard deviation.
- **raise_income:** [1.00–1.05] — Annual stochastic income growth factors.
- **decision_threshold:** 0.5 — Minimum internal motivation needed to adopt.
- **attitude, attitude_mod, subj_norm_mod, behavioral_mod:** Initially set to None — dynamically assigned during simulation to capture behavioral evolution.

**Data Collection**
- **collect_data:** True — Enables simulation logging.
- **data_save_folder:** 'data/' — Path for data output.

**Behavior Summary**
- This configuration enables a large-scale, multi-decade sustainability simulation grounded in Dutch statistics.
- It balances realism with performance, using social norm levels at the street scale and economic parameters that evolve over time.
- Designed to observe long-term adoption patterns of solar panels and heat pumps influenced by price, norms, and personal beliefs.

### enviroment.py
This module defines the Environment class, the main simulation controller, responsible for initializing and coordinating all agents and sustainability mechanisms within the simulation

#### Initialization & Setup
**__init__()**
- Loads simulation configuration.
- Initializes sustainability packages (SolarPanel, HeatPump).
- Creates households and residents.
- Groups households into streets.
- Calculates initial CO₂ emissions and installs initial packages probabilistically.

**create_agents()**
- Distributes residents evenly across households.
- Assigns initial package installations with configuration-based probabilities.
- Initializes agents’ norms and flags for package decisions.

**generate_streets()**
- Clusters households into streets of variable size using random sampling and configured limits.

**update_subjective_norm()**
- Calls each package’s norm-update method to revise residents' social norms.

#### Simulation Lifecycle
**Step**
- Resets decision counters.
- Advances all households by one step (e.g., one year).
- Updates norms and package states.

#### Data Collection & Export
**collect_environment_data()**
- Gathers high-level metrics (e.g., energy price, average income, norms, behavioral control).

**setup_data_structure(file_name)**
- Initializes a .json data file with simulation metadata and an empty structure for results.

**export_data(file_name, year)**
- Writes per-resident and environment-level data for the specified year into the results file.

**collect_start_of_year_data(year)**
- Logs package-related stats (decisions, installations, prices) at the beginning of the year.
- Stores yearly CO₂ savings.

**collect_end_of_year_data(data_from_start_of_year)**
- Appends end-of-year statistics to the existing yearly data.

**collect_household_information()**
- Returns detailed info per household and resident, useful for user interface or analysis.

#### Other

**__str__()**
- Returns a human-readable string summary of the environment's current state, including CO₂ savings and package decisions.

### main.py




### shared_state.py

### test_mvp.py

### utillities.py