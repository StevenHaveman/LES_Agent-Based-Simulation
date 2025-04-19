from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.ABM.main_mesa import run_simulation

app = Flask(__name__)

# Sta alleen frontend localhost toe
CORS(app, resources={r"/simulation": {"origins": "http://localhost:5173"}})

@app.route('/simulation', methods=['POST'])
def start_simulation():
    data = request.get_json()

    try:
        nr_households = int(data.get("nr_households", 10))
        nr_residents = int(data.get("nr_residents", 10))
        simulation_years = int(data.get("simulation_years", 30))
    except ValueError as e:
        return jsonify({"status": "error", "message": "Ongeldige input: " + str(e)}), 400

    result = run_simulation(nr_households, nr_residents, simulation_years)
    return jsonify({"status": "ok", "result": result})


if __name__ == '__main__':
    app.run(debug=True)