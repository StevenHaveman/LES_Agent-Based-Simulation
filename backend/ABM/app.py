"""
Flask application for serving the agent-based model simulation API.

This application provides endpoints to:
- Start a new simulation with specified parameters.
- Retrieve aggregated data for graphical representation.
- Fetch detailed data about individual households from the last simulation.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from main import run_simulation, graphics_data, households_data
import utilities
from main import toggle_simulation_pause, is_simulation_paused
from shared_state import set_delay, get_delay

# Initialize the Flask application
app = Flask(__name__)
config_id, chosen_config = utilities.choose_config()
# Configure CORS to allow connections from the frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.route('/config', methods=['POST'])
def start_simulation():
    """
    Start a new simulation with the provided configuration.

    Expects a JSON payload with the following optional fields:
    - nr_households: Number of households (default from chosen_config)
    - nr_residents: Number of residents (default from chosen_config, total distributed among households)
    - simulation_years: Number of simulation years (default from chosen_config)

    Returns:
        JSON response with the status and simulation result message.
        Returns a 400 error if input parameters are invalid.
    """
    data = request.get_json()

    try:
        nr_households = int(data.get("nr_households", chosen_config["nr_households"]))
        nr_residents = int(data.get("nr_residents", chosen_config["nr_residents"]))
        simulation_years = int(data.get("simulation_years", chosen_config["simulation_years"]))
    except ValueError as e:
        # Return an error message for invalid input
        return jsonify({"status": "error", "message": "Invalid input: " + str(e)}), 400

    # Run the simulation and return the result
    result = run_simulation(nr_households, nr_residents, simulation_years)
    return jsonify({"status": "ok", "result": result})


@app.route("/overview", methods=["GET"])
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

@app.route('/fetch_households', methods=['GET'])
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

@app.route('/AI_test_response', methods=['POST'])
def ai_test_response():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt.strip():
        return jsonify({"error": "Prompt is leeg."}), 400

    response = f"(AI-test response) Je zei: '{prompt}'"

    return jsonify({"response": response})

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


if __name__ == '__main__':
    app.run(debug=True)