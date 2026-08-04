/**
 * ConfigFormService Class
 *
 * This service provides methods to interact with the backend API
 * for managing simulation configurations.
 */

const API_URL = 'http://127.0.0.1:5000';


export async function startSimulation(config) {

    const response = await fetch(
        `${API_URL}/simulation`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config),
        }
    );


    if (!response.ok) {
        throw new Error(
            'Starting simulation failed'
        );
    }


    return await response.json();
}



export async function getSimulationConfigs() {

    const response = await fetch(
        `${API_URL}/simulation/configs`
    );


    if (!response.ok) {
        throw new Error(
            'Fetching simulation configs failed'
        );
    }


    return await response.json();
}