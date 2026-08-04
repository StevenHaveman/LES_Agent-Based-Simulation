import { useState, useCallback } from 'react';
import { getSimulationConfigs } from '../services/configService.js';


export function useSimulationConfigs() {

    const [configs, setConfigs] = useState({});


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


    return {
        configs,
        fetchConfigs,
    };
}