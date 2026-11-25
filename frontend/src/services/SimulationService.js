const API_URL = 'http://127.0.0.1:5000';

/**
 * Posts to a simulation control endpoint and throws with the backend's
 * message when the request is refused.
 */
async function postControl(path) {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(body.message || `Request to ${path} failed`);
    }
    return body;
}

class SimulationService {
    /** Restarts the last run from year 0 with the same settings. */
    async resetSimulation() {
        return postControl('/simulation/reset');
    }

    /** Stops the running simulation, if any. */
    async stopSimulation() {
        return postControl('/simulation/stop');
    }
}

const simulationService = new SimulationService();
export default simulationService;
