import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSimulationRun } from './useSimulationRun.js';
import { useNavigate } from '@tanstack/react-router';
import simulationService from '../services/SimulationService';

export default function useOverviewNavbarLogic({ onReset } = {}) {
    const seconds = 3;
    const [paused, setPaused] = useState(false);
    const [delay, setDelay] = useState(seconds);
    const navigate = useNavigate();

    const togglePause = async () => {
        const result = await useSimulationRun().togglePause();
        if (result?.status === 'ok') {
            toast.info(result.message);
            setPaused(result.paused);
        }
    };

    /**
     * Reset: stop the current run and start it again from year 0 with the
     * same settings. `onReset` lets the page clear its charts and map.
     */
    const resetSimulation = async () => {
        try {
            await simulationService.resetSimulation();
            setPaused(false);
            onReset?.();
        } catch (error) {
            toast.error(error.message);
        }
    };

    /**
     * Restart: stop the current run and go back to the configuration screen
     * to set up a new one.
     */
    const restartSimulation = async () => {
        try {
            await simulationService.stopSimulation();
        } catch (error) {
            toast.error(error.message);
            return;
        }
        await navigate({ to: '/' });
    };

    const updateDelay = async (e) => {
        const newDelay = parseInt(e.target.value, 10);
        setDelay(newDelay);
        await useSimulationRun().setDelay(newDelay);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            const status = await useSimulationRun().getPauseStatus();
            setPaused(status.paused);
            const delayRes = await useSimulationRun().getSimulationDelay();
            setDelay(delayRes.delay);
        };
        fetchInitialData();
    }, []);

    return {
        paused,
        delay,
        resetSimulation,
        restartSimulation,
        togglePause,
        updateDelay,
    };
}
