import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSimulationRun } from './useSimulationRun.js';
import simulationParametersService from '../services/SimulationParametersService';
import simulationService from '../services/SimulationService';

export default function useOverviewNavbarLogic() {
    const seconds = 3;
    const [paused, setPaused] = useState(false);
    const [delay, setDelay] = useState(seconds);
    const [showModal, setShowModal] = useState(false);
    const [inputParams, setInputParams] = useState({ nr_households: 10, nr_residents: 10, simulation_years: 30, seed: 0 });
    const [lastParams, setLastParams] = useState(null);

    const togglePause = async () => {
        const result = await useSimulationRun().togglePause();
        if (result?.status === 'ok') {
            toast.info(result.message);
            setPaused(result.paused);
        }
    };

    const openSimulationModal = () => setShowModal(true);

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setInputParams((prev) => ({ ...prev, [name]: value }));
    };

    const startSimulation = async (e) => {
        if (e) {e.preventDefault();}
        setShowModal(false);
        setLastParams(inputParams);
        const params = {
            ...inputParams,
            nr_households: Number(inputParams.nr_households),
            nr_residents: Number(inputParams.nr_residents),
            simulation_years: Number(inputParams.simulation_years),
            seed: Number(inputParams.seed),
        };
        const result = await simulationService.startSimulation(params);
        toast.success(result.message || 'Simulation started');
    };

    const resetSimulation = async () => {
        let paramsSource = lastParams;
        if (!paramsSource) {
            try {
                const fetchedParamsResponse = await simulationParametersService.fetchParameters();
                const fetchedParams = fetchedParamsResponse?.config ?? fetchedParamsResponse;
                paramsSource = {
                    nr_households: fetchedParams.nr_households,
                    nr_residents: fetchedParams.nr_residents,
                    simulation_years: fetchedParams.simulation_years,
                    seed: fetchedParams.seed,
                };
            } catch {
                toast.error('Could not load previous simulation parameters.');
                return;
            }
        }
        if (!paramsSource) { toast.error('No previous simulation parameters found.'); return; }
        const params = {
            ...paramsSource,
            nr_households: Number(paramsSource.nr_households),
            nr_residents: Number(paramsSource.nr_residents),
            simulation_years: Number(paramsSource.simulation_years),
            seed: Number(paramsSource.seed),
        };
        if (
            Number.isNaN(params.nr_households)
            || Number.isNaN(params.nr_residents)
            || Number.isNaN(params.simulation_years)
            || Number.isNaN(params.seed)
        ) { toast.error('Previous simulation parameters are invalid.'); return; }
        setLastParams(paramsSource);
        const result = await simulationService.startSimulation(params);
        toast.info(result.message || 'Simulation reset');
    };

    const updateDelay = async (e) => {
        const newDelay = parseInt(e.target.value, 10);
        setDelay(newDelay);
        await useSimulationRun.setDelay(newDelay);
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
        showModal,
        setShowModal,
        inputParams,
        handleParamChange,
        startSimulation,
        resetSimulation,
        togglePause,
        updateDelay,
        openSimulationModal,
    };
}
