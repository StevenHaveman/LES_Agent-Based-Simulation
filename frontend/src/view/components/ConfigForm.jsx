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

import React, { useState } from "react";
import "../styles/ConfigForm.css";
import configFormController from "../../controller/ConfigController.js";
import { useNavigate } from "@tanstack/react-router";

const ConfigForm = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        nr_households: 10, // Default number of households
        nr_residents: 10,  // Default number of residents per household
        simulation_years: 30, // Default simulation duration in years
        seed: "" // Default random seed (empty string)
    });

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
        e.preventDefault(); // Prevent default form submission behavior
        await navigate({ to: "/overview" }); // Navigate to the overview page

        try {
            // Prepare the payload for the simulation
            const payload = {
                ...formData,
                seed: formData.seed === "" ? 0 : Number(formData.seed) // Default seed to 0 if empty
            };

            // Start the simulation using the controller
            await configFormController.startSimulation(payload);
        } catch (error) {
            console.error("Simulation start failed", error); // Log any errors
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
                        {/* Input for number of households */}
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

                        {/* Input for number of residents */}
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

                        {/* Input for simulation duration */}
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

                        {/* Input for random seed */}
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