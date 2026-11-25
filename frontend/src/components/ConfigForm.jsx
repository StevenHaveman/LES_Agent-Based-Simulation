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
        fetchConfigs,
        areas,
        fetchAreas
    } = useSimulationConfigs();


    // Selected backend configuration
    const [selectedConfig, setSelectedConfig] = useState(1);

    // Selected neighbourhood (null until the backend's default is known)
    const [selectedArea, setSelectedArea] = useState(null);

    // Error from the backend when starting fails (e.g. a run is still going)
    const [startError, setStartError] = useState(null);

    // Controls visibility of advanced settings
    const [showAdvanced, setShowAdvanced] = useState(false);


    // Stores current simulation parameters
    const [formData, setFormData] = useState({});


    /**
     * Loads available configurations from Flask.
     */
    useEffect(() => {
        fetchConfigs();
        fetchAreas();
    }, [fetchConfigs, fetchAreas]);


    /**
     * Preselects the backend's default neighbourhood once areas are loaded.
     */
    useEffect(() => {
        if (selectedArea === null && areas.default) {
            setSelectedArea(areas.default);
        }
    }, [areas, selectedArea]);


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

        let parsedValue;

        if (type === "checkbox") {
            parsedValue = checked;
        } else if (type === "number") {
            parsedValue = value === "" ? "" : Number(value);
        } else {
            parsedValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
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

        setStartError(null);

        const payload = {

            ...formData,

            config_id: selectedConfig,

            ...(selectedArea ? { area: selectedArea } : {}),

            seed:
                formData.seed === ''
                    ? 0
                    : Number(formData.seed)

        };


        // Only go to the overview once the backend accepted the run;
        // otherwise the overview would show whatever simulation is running.
        try {

            await start(payload);

        } catch (error) {

            setStartError(error.message);

            return;

        }


        await navigate({
            to: '/overview'
        });

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


                        {/* Neighbourhood selector */}

                        <div className="form-group">

                            <label
                                htmlFor="area"
                                className="form-label"
                            >
                                Neighbourhood
                            </label>


                            <select

                                id="area"

                                className="form-input"

                                value={selectedArea ?? ''}

                                onChange={(e) =>
                                    setSelectedArea(e.target.value)
                                }

                            >

                                {
                                    areas.areas.map(area => (

                                        <option
                                            key={area.key}
                                            value={area.key}
                                        >
                                            {area.name}
                                        </option>

                                    ))
                                }

                            </select>

                        </div>



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

                        {
                            startError && (
                                <p
                                    className="form-error-message"
                                    role="alert"
                                >
                                    {startError}
                                </p>
                            )
                        }


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