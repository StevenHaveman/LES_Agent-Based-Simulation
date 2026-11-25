import { useState, useCallback } from 'react';
import { getSimulationConfigs, getSimulationAreas } from '../services/ConfigService.js';


export function useSimulationConfigs() {

    const [configs, setConfigs] = useState({});

    // Neighbourhoods that can be simulated: { default: key, areas: [{ key, name }] }
    const [areas, setAreas] = useState({ default: null, areas: [] });


    const fetchConfigs = useCallback(async () => {

        try {

            const data = await getSimulationConfigs();

            setConfigs(data);

        } catch (error) {

            console.error(
                'Loading configs failed',
                error
            );

        }

    }, []);


    const fetchAreas = useCallback(async () => {

        try {

            const data = await getSimulationAreas();

            setAreas(data);

        } catch (error) {

            console.error(
                'Loading areas failed',
                error
            );

        }

    }, []);


    return {
        configs,
        fetchConfigs,
        areas,
        fetchAreas,
    };
}
