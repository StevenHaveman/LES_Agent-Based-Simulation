const API_URL = "http://127.0.0.1:5000";

class OverviewService {

    /**
     * Fetches the graphical results of the simulation.
     * @returns {Promise<Object>} - The graphical data of the simulation.
     * @throws {Error} - Throws an error if the API call fails.
     */
    async getSimulationGraphicResults() {
        const response = await fetch(`${API_URL}/overview`);

        if (!response.ok) {
            throw new Error("Fetching simulation graphic results failed");
        }

        return await response.json();
    }
}

// Exporting an instance of OverviewService.
const overviewService = new OverviewService();
export default overviewService