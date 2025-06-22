/**
 * ConfigFormService Class
 *
 * This class provides methods to interact with the backend API for managing simulation configurations.
 * It includes functionality to start a simulation by sending the configuration data to the server.
 *
 * Constants:
 * - `API_URL` (string): The base URL of the backend API.
 *
 * Methods:
 * - `start_simulation(config)`: Sends a POST request to the `/simulation` endpoint to start the simulation.
 *   - Parameters:
 *     - `config` (Object): The configuration object containing simulation parameters.
 *       - `nr_households` (number): Number of households for the simulation.
 *       - `nr_residents` (number): Number of residents per household.
 *       - `simulation_years` (number): Duration of the simulation in years.
 *   - Returns:
 *     - A Promise resolving to the response data from the server.
 *   - Throws:
 *     - An error if the API call fails (e.g., non-OK HTTP response).
 */

const API_URL = "http://127.0.0.1:5000";

class ConfigFormService {

    async start_simulation(config) {
        const response = await fetch(`${API_URL}/simulation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!response.ok) {
            throw new Error("Starting simulation failed");
        }
        return await response.json();
    }
}

const configFormService = new ConfigFormService();
export default configFormService;