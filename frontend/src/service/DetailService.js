const API_URL = "http://127.0.0.1:5000";

class DetailService{

    async fetchHouseholds() {
        const response = await fetch(`${API_URL}/fetch_households`);
        if (!response.ok) {
            throw new Error("Fetching households failed");
        }
        return await response.json();
    }

}
// Exporting an instance of DetailService.
const detailService = new DetailService();
export default detailService;