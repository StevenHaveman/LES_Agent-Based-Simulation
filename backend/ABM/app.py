from flask import Flask, request, jsonify
from flask_cors import CORS
from main import run_simulation, graphics_data, households_data
import config
import utilities
# Initialize the Flask application
app = Flask(__name__)
chosen_config = utilities.choose_config()

# Configure CORS to allow connections from the frontend
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/config', methods=['POST'])
def start_simulation():
    """
    Start a new simulation with the provided configuration.

    Expects a JSON payload with the following fields:
    - nr_households: Number of households (default: 10)
    - nr_residents: Number of residents per household (default: 10)
    - simulation_years: Number of simulation years (default: 30)

    Returns:
        JSON response with the status and simulation result.
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
    Retrieve the graphical data from the simulation.

    Returns:
        JSON response with the graphical data or an error message if no data is available.
    """
    if not graphics_data:
        return jsonify({"error": "No simulation data available"}), 400
    return jsonify(graphics_data)

@app.route('/fetch_households', methods=['GET'])
def fetch_households():
    """
    Retrieve the household data from the simulation.

    Returns:
        JSON response with the household data or an error message if no data is available.
    """
    if not households_data:
        return jsonify({"error": "No household data available"}), 400
    return jsonify(households_data)


if __name__ == '__main__':
    # Run the Flask application in debug mode
    app.run(debug=True)