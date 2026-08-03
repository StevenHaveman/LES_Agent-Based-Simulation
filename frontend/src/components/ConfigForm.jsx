/**
 * ConfigForm Component
 *
 * This React component provides a form for configuring and starting a simulation.
 * Users can input parameters such as the number of households, number of residents,
 * simulation duration, and an optional random seed. Upon submission, the simulation
 * is started and the user is navigated to the `/overview` page.
 *
 * State:
 * - `formData`: An object containing the simulation parameters.
 *   - `nr_households` (number): Number of households for the simulation (default: 10).
 *   - `nr_residents` (number): Number of residents per household (default: 10).
 *   - `simulation_years` (number): Duration of the simulation in years (default: 30).
 *   - `seed` (string): Random seed for the simulation (optional, default: empty string).
 *
 * Props:
 * - None
 *
 * Returns:
 * - A React component that renders a form for configuring the simulation.
 */

import React, { useState, useEffect } from 'react';
import '../styles/ConfigForm.css';
import { useSimulation } from '../hooks/useSimulation.js';
import { useSimulationConfigs } from '../hooks/useSimulationConfigs.js';
import { useNavigate } from '@tanstack/react-router';

const ConfigForm = () => {
    const { start } = useSimulation();

    const {
        configs,
        fetchConfigs
    } = useSimulationConfigs();


    const [selectedConfig, setSelectedConfig] = useState(1);

    const [formData, setFormData] = useState({

        simulation_years: 30,

        seed: '',

        min_nr_houses: '',
        max_nr_houses: '',

        social_norm_radius: '',
        subj_norm_level: '',

        household_decision_threshold: '',
        renovation_cooldown: '',

        intention_threshold: '',

        attitude_sensitivity: '',
        norm_sensitivity: '',
        control_sensitivity: '',

        weight_attitude: '',
        weight_norm: '',
        weight_control: ''

    });


    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    useEffect(() => {

        const selected = configs[selectedConfig];

        if (!selected) {
            return;
        }

        console.log("Loading config settings:", selected.settings);

        setFormData({
            ...selected.settings,

            // extra frontend opties
            simulation_years: 30,
            seed: selected.settings.seed ?? ''
        });

    }, [selectedConfig, configs]);

    // Hook for navigation
    const navigate = useNavigate();

    /**
     * Handles changes to the form inputs.
     * Updates the `formData` state with the new input values.
     *
     * @param {Object} e - The event object from the input change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles form submission to start the simulation.
     * Navigates to the `/overview` page and sends the simulation parameters to the backend.
     *
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        await navigate({ to: '/overview' });

        try {
            const payload = {
                ...formData,
                config_id: selectedConfig,
                seed: formData.seed === '' ? 0 : Number(formData.seed)
            };
            
            await start(payload);
        } catch (error) {
            console.error('Simulation start failed', error);
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <section className="form-card">
                    <header className="form-header">
                        <h1 className="form-title">
                            Configure Simulation
                        </h1>
                        <p className="form-subtitle">
                            Select configuration and simulation settings
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="form-body">

                        {/* Simulation configuration selector */}
                        <div className="form-group">
                            <label className="form-label">
                                Simulation Configuration
                            </label>

                            <select
                                className="form-input"
                                value={selectedConfig}
                                onChange={(e) =>
                                    setSelectedConfig(Number(e.target.value))
                                }
                            >
                                {Object.entries(configs).map(([id, config]) => (
                                    <option
                                        key={id}
                                        value={id}
                                    >
                                        {config.name ?? `Config ${id}`}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* Simulation duration */}
                        <div className="form-group">
                            <label
                                htmlFor="simulation_years"
                                className="form-label"
                            >
                                Duration of Simulation (years)
                            </label>

                            <input
                                type="number"
                                id="simulation_years"
                                name="simulation_years"
                                value={formData.simulation_years}
                                onChange={handleChange}
                                className="form-input"
                                min="1"
                                required
                            />
                        </div>


                        {/* Random seed */}
                        <div className="form-group">
                            <label
                                htmlFor="seed"
                                className="form-label"
                            >
                                Random Seed (optional)
                            </label>

                            <input
                                type="number"
                                id="seed"
                                name="seed"
                                value={formData.seed}
                                onChange={handleChange}
                                className="form-input"
                                min="0"
                                placeholder="0 (default if empty)"
                            />
                        </div>


                        {/* Submit button */}
                        <button
                            type="submit"
                            className="form-button"
                        >
                            Start Simulation
                        </button>

                    </form>
                </section>
            </div>
        </div>
    );
};

export default ConfigForm;
