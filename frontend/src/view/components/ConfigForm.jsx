/**
 * Component for configuring and starting the simulation.
 *
 * State:
 * @property {Object} formData - The form data containing simulation parameters.
 * @property {string} formData.email - The user's email (not used in the simulation).
 * @property {string} formData.password - The user's password (not used in the simulation).
 * @property {number} formData.nr_households - Number of households for the simulation.
 * @property {number} formData.nr_residents - Number of residents per household.
 * @property {number} formData.simulation_years - Duration of the simulation in years.
 *
 * Props:
 * None
 *
 * Returns:
 * A React component that renders a form for configuring the simulation.
 */

import React, { useState } from "react";
import "../styles/ConfigForm.css";
import configFormController from "../../controller/ConfigFormController.js";
import { useNavigate } from "@tanstack/react-router";

const ConfigForm = () => {
    const [formData, setFormData] = useState({
        nr_households: 10,
        nr_residents: 10,
        simulation_years: 30,
        seed: ""

    });
    const navigate = useNavigate();

    /**
     * Handles changes to the form inputs.
     * @param {Object} e - The event object from the input change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles form submission to start the simulation.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        await navigate({ to: "/overview" });

        try {
            // Als seed leeg is (""), gebruik 0 als default
            const payload = {
                ...formData,
                seed: formData.seed === "" ? 0 : Number(formData.seed)
            };

            await configFormController.startSimulation(payload);
        } catch (error) {
            console.error("Simulation start failed", error);
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <section className="form-card">
                    <header className="form-header">
                        <h1 className="form-title">Configure Simulation</h1>
                        <p className="form-subtitle">Put Starting Values</p>
                    </header>
                    <form onSubmit={handleSubmit} className="form-body">
                        <div className="form-group">
                            <label htmlFor="nr_households" className="form-label">Number of Households</label>
                            <input
                                type="number"
                                id="nr_households"
                                name="nr_households"
                                value={formData.nr_households}
                                onChange={handleChange}
                                className="form-input"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nr_residents" className="form-label">Number of Residents</label>
                            <input
                                type="number"
                                id="nr_residents"
                                name="nr_residents"
                                value={formData.nr_residents}
                                onChange={handleChange}
                                className="form-input"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="simulation_years" className="form-label">Duration of Simulation (years)</label>
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
                        <div className="form-group">
                            <label htmlFor="seed" className="form-label">Random Seed (optional)</label>
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
