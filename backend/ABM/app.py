"""
Flask application for serving the agent-based model simulation API.

This application provides endpoints to:
- Start a new simulation with specified parameters.
- Retrieve aggregated data for graphical representation.
- Fetch detailed data about individual households from the last simulation.
"""

from __future__ import annotations
from py_compile import main
from flask import Flask, request, jsonify
from flask_cors import CORS
from main import run_simulation, graphics_data, households_data, households_historical_data, kpi_data
import config_utils
import utilities
import threading
import traceback
import main

from AgentLLMHandler import AgentLLMHandler

from main import toggle_simulation_pause, is_simulation_paused
from shared_state import set_delay, get_delay
import config

# Initialize the Flask application
app = Flask(__name__)
config_id, chosen_config = utilities.choose_config() # Configuration loading for the simulation, this is not used in the frontend defaults to config 1
llm_handler = AgentLLMHandler("llama3.1:8b", chosen_config)
# Configure CORS to allow connections from the frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
simulation_thread = None
simulation_running = False


@app.route('/simulation', methods=['POST'])
def start_simulation():
    global simulation_thread, simulation_running

    data = request.get_json()
    config_id = int(data["config_id"])

    simulation_config = config.configs[config_id].copy()

    for key, value in data.items():

        if key in simulation_config:
            simulation_config[key] = value

    if simulation_thread and simulation_thread.is_alive():
        return jsonify({
            "status": "error",
            "message": "Simulation already running. Please wait for it to finish or stop it before starting a new one."
        }), 400

    try:
        simulation_years = int(data.get("simulation_years"))
        seed = int(data.get("seed", config.configs[config_id].get("seed", None)))

        simulation_config["simulation_years"] = simulation_years
        simulation_config["seed"] = seed
    except (ValueError, TypeError) as e:
        return jsonify({
            "status": "error",
            "message": "Invalid input: " + str(e)
        }), 400

    def run():
        global simulation_running
        simulation_running = True

        try:
            print("=== Simulation started ===")
            run_simulation(
                simulation_years=simulation_years,
                config=simulation_config
            )
            print("=== Simulation finished ===")
        except Exception as e:
            print(f"Simulation error: {e}")
            traceback.print_exc()
        finally:
            simulation_running = False

    simulation_thread = threading.Thread(target=run)
    simulation_thread.daemon = True  # stopt automatisch bij server shutdown
    simulation_thread.start()

    return jsonify({
        "status": "ok",
        "message": "Simulation started",
        "parameters": {
            "simulation_years": simulation_years,
            "seed": seed
        }
    })

@app.route("/graphics_data", methods=["GET"])
def get_graphics_data():
    """
    Retrieve the graphical data from the most recently run simulation.

    This data is typically aggregated per year and suitable for plotting.

    Returns:
        JSON response with the graphical data.
        Returns a 400 error if no simulation data is available.
    """
    if not graphics_data:
        return jsonify({"error": "No simulation data available"}), 400
    return jsonify(graphics_data)


@app.route('/households', methods=['GET'])
def fetch_households():
    """
    Retrieve detailed household data from the most recently run simulation.

    This includes information about each household and its residents.

    Returns:
        JSON response with the household data.
        Returns a 400 error if no household data is available.
    """
    if not households_data:
        return jsonify({"error": "No household data available"}), 400
    return jsonify(households_data)

@app.route('/households_historical', methods=['GET'])
def fetch_households_historical():
    return jsonify(households_historical_data if households_historical_data else [])

@app.route('/kpi_data', methods=['GET'])
def fetch_kpi_data():
    """
    Retrieve KPI data from the most recently run simulation.

    This includes information about the simulation's performance metrics.

    Returns:
        JSON response with the KPI data.
        Returns a 400 error if no KPI data is available.
    """
    if not kpi_data:
        return jsonify({"error": "No KPI data available"}), 400
    return jsonify(kpi_data)


@app.route('/AI_response', methods=['POST'])
def ai_test_response():
    ## Test updates -Dave
    # Messages worden waarscheinlijk uit de json gehaald voor een specfieke agent.
    # TODO: Veranderd dit naar een nette manier  Voor nu gehard code.

    data = request.get_json()

    prompt = data.get("prompt", "")
    resident_info = data.get("resident_id")
    # print(resident_id)

    print(f"Prompt: {prompt}, Resident ID: {resident_info['unique_id']}")

    try:
        response = llm_handler.chat(resident_info['unique_id'], prompt)
        return jsonify({"response": response})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route('/toggle_pause', methods=['POST'])
def toggle_pause():
    new_state = toggle_simulation_pause()
    return jsonify({
        "status": "ok",
        "paused": new_state,
        "message": "Simulatie gepauzeerd" if new_state else "Simulatie hervat"
    })


@app.route('/pause_status', methods=['GET'])
def get_pause_status():
    return jsonify({"paused": is_simulation_paused()})


@app.route('/set_delay', methods=['POST'])
def set_delay_route():
    data = request.get_json()
    delay = data.get("delay")

    try:
        delay_int = int(delay)
        set_delay(delay_int)
        return jsonify({"status": "ok", "message": f"Delay ingesteld op {delay_int} seconden."})
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Ongeldige delay-waarde."}), 400


@app.route('/get_delay', methods=['GET'])
def get_delay_route():
    return jsonify({"delay": get_delay()})


@app.route('/get_config', methods=['GET'])
def get_config():
    if config_id not in config.configs:
        return jsonify({"status": "error", "message": f"Config ID {config_id} niet gevonden."}), 404

    conf = config.configs[config_id]
    filtered_config = {
        "nr_households": conf.get("nr_households"),
        "nr_residents": conf.get("nr_residents"),
        "simulation_years": conf.get("simulation_years"),
        "seed": conf.get("seed")
    }
    return jsonify({
        "status": "ok",
        "config_id": config_id,
        "config": filtered_config
    })


@app.route('/update_parameter', methods=['POST'])
def update_single_parameter():
    data = request.get_json()
    key = data.get("parameter")
    value = data.get("value")

    if not key:
        return jsonify({"status": "error", "message": "Geen parameternaam opgegeven."}), 400

    conf = config.configs.get(config_id)
    if not conf:
        return jsonify({"status": "error", "message": f"Config ID {config_id} niet gevonden."}), 404

    if key not in conf:
        return jsonify({"status": "error", "message": f"Parameter '{key}' bestaat niet in de config."}), 400

    conf[key] = value
    return jsonify({
        "status": "ok",
        "updated": {key: value},
        "message": f"Parameter '{key}' succesvol bijgewerkt."
    })


@app.route('/get_full_config_values', methods=['GET'])
def get_full_config_values():
    if config_id not in config.configs:
        return jsonify({"status": "error", "message": f"Config ID {config_id} niet gevonden."}), 404

    full_config = config.configs[config_id]

    return jsonify({
        "status": "ok",
        "config_id": config_id,
        "config": full_config
    })


@app.route('/parameters', methods=['GET'])
def parameters():
    if config_id not in config.configs:
        return jsonify({"status": "error", "message": f"Config ID {config_id} niet gevonden."}), 404

    return jsonify({
        "status": "ok",
        "config_id": config_id,
        "config": config.configs[config_id]
    })

@app.route('/config', methods=["GET"])
def get_sim_config():
    return jsonify(chosen_config)

@app.route("/policy/sustainability_campaign", methods=["POST"])
def sustainability_campaign():
    if main.model is None:
        return jsonify({"error": "Simulation not running"}), 400

    main.model.policy.sustainability_information_campaign()
    main.model.log_municipality_event("Sustainability Campaign Announced")

    return jsonify({
        "status": "ok"
    })

@app.route("/policy/financial_subsidy", methods=["POST"])
def financial_subsidy():
    if main.model is None:
        return jsonify({"error": "Simulation not running"}), 400

    data = request.get_json()

    if data is None:
        return jsonify({"error": "No data received"}), 400

    amount = data.get("amount", 0)

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid subsidy amount"}), 400

    if amount < 0:
        return jsonify({"error": "Subsidy amount cannot be negative"}), 400

    main.model.policy.financial_subsidy(amount)

    main.model.log_municipality_event(
        "Financial Subsidy",
        {
            "amount": amount
        }
    )

    return jsonify({
        "status": "ok",
        "amount": amount
    })

@app.route("/policy/heat_grid", methods=["POST"])
def heat_grid():
    if main.model is None:
        return jsonify({"error": "Simulation not running"}), 400

    main.model.policy.announce_heat_grid()
    main.model.log_municipality_event("Heat Grid Announced")

    return jsonify({"status": "ok"})

@app.route("/update_social_norm_radius", methods=["POST"])
def update_social_norm_radius():
    if main.model is None:
        return jsonify({"error": "Simulation not running"}), 400

    data = request.get_json()
    radius = data.get("radius")

    try:
        radius = int(radius)
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Invalid radius value"
        }), 400

    if radius < 0:
        return jsonify({
            "status": "error",
            "message": "Radius cannot be negative"
        }), 400

    old_radius = main.model.social_norm_radius
    main.model.social_norm_radius = radius

    main.model.log_municipality_event(
        "Social Norm Radius Changed",
        {
            "old_radius": old_radius,
            "new_radius": radius
        }
    )

    print(f"Social norm radius updated to {radius} meters")

    return jsonify({
        "status": "ok",
        "social_norm_radius": radius
    })

@app.route("/simulation/configs", methods=["GET"])
def get_configs():

    return jsonify(config_utils.get_frontend_configs())


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
