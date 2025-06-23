/**
 * OverviewService Class
 *
 * This class provides methods to interact with the backend API for fetching household data,
 * simulation delay, and simulation graphic results.
 *
 * Constants:
 * - `API_URL` (string): The base URL of the backend API.
 *
 * Methods:
 * - `fetchHouseholds()`: Fetches household data from the `/fetch_households` endpoint.
 *   - Returns:
 *     - A Promise resolving to the fetched household data (JSON format).
 *   - Throws:
 *     - An error if the API call fails (e.g., non-OK HTTP response).
 *
 * - `getSimulationDelay()`: Retrieves the simulation delay from the `/get_delay` endpoint.
 *   - Returns:
 *     - A Promise resolving to the delay value (JSON format).
 *   - Throws:
 *     - An error if the API call fails (e.g., non-OK HTTP response).
 *
 * - `getSimulationGraphicResults()`: Fetches simulation graphic results from the `/overview` endpoint.
 *   - Returns:
 *     - A Promise resolving to the simulation graphic results (JSON format).
 *   - Throws:
 *     - An error if the API call fails (e.g., non-OK HTTP response).
 */

const API_URL = "http://127.0.0.1:5000";

class OverviewService {

    async fetchHouseholds() {
        const response = await fetch(`${API_URL}/fetch_households`);
        if (!response.ok) {
            throw new Error("Fetching households failed");
        }
        return await response.json();
    }


    async getSimulationDelay() {
        const response = await fetch(`${API_URL}/get_delay`);

        if (!response.ok) {
            throw new Error("Fetching delay failed");
        }

        return await response.json();
    }


    async fetchSimulationConfig() {
        const response = await fetch(`${API_URL}/config`, { method: "GET" });
        if (!response.ok) {
            throw new Error("Fetching sim config failed");
        }
        return await response.json();
    }


    async getSimulationGraphicResults() {
        const response = await fetch(`${API_URL}/overview`);

        if (!response.ok) {
            throw new Error("Fetching simulation graphic results failed");
        }

        return await response.json();
    }

}
const overviewService = new OverviewService();
export default overviewService;