const API_URL = "http://127.0.0.1:5000";

class DetailService{

    async fetchHouseholds() {
        const response = await fetch(`${API_URL}/fetch_households`);
        if (!response.ok) {
            throw new Error("Fetching households failed");
        }
        return await response.json();
    }

    async getDelay() {
        const res = await fetch(`${API_URL}/get_delay`);
        if (!res.ok) throw new Error("Failed to fetch delay");
        return await res.json();
    }

}
// Exporting an instance of DetailService.
const detailService = new DetailService();
export default detailService;