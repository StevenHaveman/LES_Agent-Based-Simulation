from flask import Flask, request, jsonify
from flask_cors import CORS
from main import run_simulation, graphics_data, households_data
import config

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/config', methods=['POST'])
def start_simulation():
    data = request.get_json()

    try:
        nr_households = int(data.get("nr_households", config["nr_households"]))
        nr_residents = int(data.get("nr_residents", config["nr_residents"]))
        simulation_years = int(data.get("simulation_years", config["simulation_years"]))
    except ValueError as e:
        return jsonify({"status": "error", "message": "Ongeldige input: " + str(e)}), 400

    result = run_simulation(nr_households, nr_residents, simulation_years)
    return jsonify({"status": "ok", "result": result})


@app.route("/overview", methods=["GET"])
def get_graphics_data():
    if not graphics_data:
        return jsonify({"error": "No simulation data available"}), 400
    return jsonify(graphics_data)

@app.route('/fetch_households', methods=['GET'])
def fetch_households():
    if not households_data:
        return jsonify({"error": "No household data available"}), 400
    return jsonify(households_data)


if __name__ == '__main__':
    app.run(debug=True)