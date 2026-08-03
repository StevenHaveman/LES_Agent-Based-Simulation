/**
 * ConfigForm Component
 *
 * This React component provides a form for configuring and starting an agent-based
 * simulation. Users can select a predefined configuration from the backend and
 * adjust simulation parameters before starting the simulation.
 *
 * Features:
 * - Loads available simulation configurations from the backend.
 * - Automatically fills form fields based on the selected configuration.
 * - Separates basic and advanced simulation settings.
 * - Sends the selected configuration and modified parameters to the backend.
 *
 * State:
 * - `selectedConfig` (number):
 *      ID of the currently selected simulation configuration.
 *
 * - `showAdvanced` (boolean):
 *      Controls visibility of advanced configuration settings.
 *
 * - `formData` (object):
 *      Contains all simulation parameters that will be sent to the backend.
 *
 * Props:
 * - None
 *
 * Returns:
 * - A React component containing the simulation configuration form.
 */

import React, { useState, useEffect } from 'react';
import '../styles/ConfigForm.css';
import { useSimulation } from '../hooks/useSimulation.js';
import { useSimulationConfigs } from '../hooks/useSimulationConfigs.js';
import { useNavigate } from '@tanstack/react-router';


/**
 * Basic simulation settings displayed by default.
 */
const basicSettings = [
    {
        key: "simulation_years",
        label: "Simulation Duration (years)"
    },
    {
        key: "seed",
        label: "Random Seed"
    },
    {
        key: "min_nr_houses",
        label: "Minimum Houses"
    },
    {
        key: "max_nr_houses",
        label: "Maximum Houses"
    },
    {
        key: "social_norm_radius",
        label: "Social Norm Radius"
    }
];


/**
 * Advanced simulation parameters.
 * These settings are hidden by default because they are mainly
 * used for experiments and model calibration.
 */
const advancedSettings = [
    {
        key: "household_decision_threshold",
        label: "Household Decision Threshold"
    },
    {
        key: "renovation_cooldown",
        label: "Renovation Cooldown"
    },
    {
        key: "decision_threshold",
        label: "Decision Threshold"
    },
    {
        key: "intention_threshold",
        label: "Intention Threshold"
    },
    {
        key: "attitude_sensitivity",
        label: "Attitude Sensitivity"
    },
    {
        key: "norm_sensitivity",
        label: "Norm Sensitivity"
    },
    {
        key: "control_sensitivity",
        label: "Control Sensitivity"
    },
    {
        key: "weight_attitude",
        label: "Attitude Weight"
    },
    {
        key: "weight_norm",
        label: "Norm Weight"
    },
    {
        key: "weight_control",
        label: "Control Weight"
    },
    {
        key: "random_sensitivities",
        label: "Random Sensitivities",
        type: "checkbox"
    }
];


const ConfigForm = () => {

    const { start } = useSimulation();

    const {
        configs,
        fetchConfigs
    } = useSimulationConfigs();


    // Selected backend configuration
    const [selectedConfig, setSelectedConfig] = useState(1);

    // Controls visibility of advanced settings
    const [showAdvanced, setShowAdvanced] = useState(false);


    // Stores current simulation parameters
    const [formData, setFormData] = useState({});


    /**
     * Loads available configurations from Flask.
     */
    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);


    /**
     * Updates form values when a different configuration is selected.
     */
    useEffect(() => {

        const selected = configs[selectedConfig];

        if (!selected) {
            return;
        }

        console.log(
            "Loading config settings:",
            selected.settings
        );


        setFormData({
            ...selected.settings,

            // Frontend-only simulation options
            simulation_years: 30,
            seed: selected.settings.seed ?? ''
        });

    }, [selectedConfig, configs]);


    const navigate = useNavigate();


    /**
     * Handles changes in input fields.
     *
     * Supports both normal inputs and checkboxes.
     */
    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };


    /**
     * Generates input fields dynamically based on settings.
     *
     * @param {string} key - Configuration property name.
     * @param {string} label - Display label.
     * @param {string} type - Input type.
     */
    const renderInput = (
        key,
        label,
        type = "number"
    ) => {


        if (!(key in formData)) {
            return null;
        }


        return (

            <div
                className="form-group"
                key={key}
            >

                <label
                    htmlFor={key}
                    className="form-label"
                >
                    {label}
                </label>


                <input

                    type={type}

                    id={key}

                    name={key}

                    value={
                        type !== "checkbox"
                            ? formData[key]
                            : undefined
                    }

                    checked={
                        type === "checkbox"
                            ? formData[key]
                            : undefined
                    }

                    onChange={handleChange}

                    className="form-input"

                />

            </div>

        );
    };



    /**
     * Starts the simulation.
     *
     * Sends selected configuration ID and modified settings
     * to the backend API.
     */
    const handleSubmit = async (e) => {

        e.preventDefault();

        await navigate({
            to: '/overview'
        });


        try {

            const payload = {

                ...formData,

                config_id: selectedConfig,

                seed:
                    formData.seed === ''
                        ? 0
                        : Number(formData.seed)

            };


            await start(payload);


        } catch (error) {

            console.error(
                'Simulation start failed',
                error
            );

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



                    <form
                        onSubmit={handleSubmit}
                        className="form-body"
                    >


                        {/* Configuration selector */}

                        <div className="form-group">

                            <label className="form-label">
                                Simulation Configuration
                            </label>


                            <select

                                className="form-input"

                                value={selectedConfig}

                                onChange={(e) =>
                                    setSelectedConfig(
                                        Number(e.target.value)
                                    )
                                }

                            >

                                {
                                    Object.entries(configs)
                                    .map(([id, config]) => (

                                        <option
                                            key={id}
                                            value={id}
                                        >
                                            {
                                                config.name ??
                                                `Config ${id}`
                                            }

                                        </option>

                                    ))
                                }

                            </select>

                        </div>



                        <h3>
                            Simulation Settings
                        </h3>


                        {
                            basicSettings.map(setting =>
                                renderInput(
                                    setting.key,
                                    setting.label,
                                    setting.type
                                )
                            )
                        }



                        {/* Advanced settings toggle */}

                        <button

                            type="button"

                            className="form-button"

                            onClick={() =>
                                setShowAdvanced(!showAdvanced)
                            }

                        >

                            {
                                showAdvanced
                                    ? "Hide Advanced Settings"
                                    : "Show Advanced Settings"
                            }

                        </button>




                        {
                            showAdvanced && (

                                <div className="advanced-container">

                                    <h3>
                                        Advanced Settings
                                    </h3>


                                    {
                                        advancedSettings.map(setting =>
                                            renderInput(
                                                setting.key,
                                                setting.label,
                                                setting.type
                                            )
                                        )
                                    }

                                </div>

                            )
                        }



                        {/* Start simulation */}

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