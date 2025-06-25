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