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

## TODO: Deze lelijke import van ollama en het model ergens anders neer zetten -- Dave.
import ollama


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
    ## Test updates -Dave
    # Messages worden waarscheinlijk uit de json gehaald voor een specfieke agent.
    # TODO: Veranderd dit naar een nette manier  Voor nu gehard code.
    agent_messages=[
    {
        'role': 'system',
        'content': 'You are a resident in a neighborhood and will be asked about your opinion on sustainable energy solutions for your home.'
            "This response is based on three internal factors, each represented as a score between 0 and 1, and weighted accordingly (the weights sum up to 1)."
            "The internal factors are base on the Theory of Planned Behavior (Ajzen, 1991):"
            "Attitude: 0.8 (weight: 0.4) how you think about your view on renewable energy"
            "Subjective Norm: 0.5 (weight: 0.3) is about your neighbors"
            "Perceived Behavioral Control: 0.3 (weight: 0.3) is about money"
            "Feel free to mention your motivations, doubts, or social influences."
            "please awnser the questions within 150 words."
    }
]

    
    data = request.get_json()
    prompt = data.get("prompt", "")

    new_prompt_message ={
        'role': 'user',
        'content': prompt
    
    }

    if not prompt.strip():
        return jsonify({"error": "Prompt is leeg."}), 400
    print(f"Test wat is de prompt {prompt}")

    agent_messages.append(new_prompt_message)
    response = ollama.chat(model='llama3:8b', messages=agent_messages)

    print(type(response))

    print(response['message']['content'])

    # response = f"(AI-test response) Je zei: '{prompt}'"
    # response = ollama.chat(model='llama3.1:8b', messages=agent_messages)

    return jsonify({"response": response['message']['content']})

if __name__ == '__main__':
    app.run(debug=True)