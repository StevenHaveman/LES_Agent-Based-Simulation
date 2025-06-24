import React, { useEffect, useState } from "react";
import "../styles/Parameters.css";
import simulationParametersController from "../../controller/SimulationParametersController.js";

/**
 * SimulationParameters component provides a user interface for managing simulation parameters.
 * It allows users to select a parameter, input a new value, and update the parameter.
 *
 * @returns {JSX.Element} The rendered SimulationParameters component.
 */
const SimulationParameters = () => {
    // State to store the list of available simulation parameters.
    const [options, setOptions] = useState([]);
    // State to store the currently selected parameter key.
    const [selectedKey, setSelectedKey] = useState("");
    // State to store the input value for the selected parameter.
    const [inputValue, setInputValue] = useState("");

    /**
     * Fetches the list of simulation parameters when the component is mounted.
     */
    useEffect(() => {
        fetchOptions();
    }, []);

    /**
     * Fetches the simulation parameters from the controller and updates the state.
     * Logs an error to the console if the fetch operation fails.
     */
    const fetchOptions = async () => {
        try {
            const opts = await simulationParametersController.fetchParameters();
            setOptions(opts);
        } catch (error) {
            console.error("Fout bij ophalen parameters:", error);
        }
    };

    /**
     * Handles the submission of a new parameter value.
     * Updates the selected parameter with the new value and refreshes the parameter list.
     * Displays an alert with the update result or logs an error if the update fails.
     */
    const handleSubmit = async () => {
        try {
            const newValue = parseFloat(inputValue);
            const result = await simulationParametersController.updateParameter(selectedKey, newValue);

            alert(`Parameter "${selectedKey}" is bijgewerkt naar waarde: ${newValue}`);

            await fetchOptions();

            // Reset the form fields after successful update.
            setSelectedKey("");
            setInputValue("");
        } catch (error) {
            console.error("Fout bij updaten:", error);
            alert("Bijwerken mislukt. Zie console voor details.");
        }
    };

    return (
        <div className="parameters-config-container">
            <h1>Simulation Parameters</h1>

            <div className="form-group">
                <label>Choose Parameter</label>
                <select
                    className="form-input"
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                >
                    <option value="">...</option>
                    {options.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                            {opt.key} (huidig: {opt.value})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>New Value</label>
                <input
                    className="form-input"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={!selectedKey}
                />
            </div>

            <button
                className="form-button"
                onClick={handleSubmit}
                disabled={!selectedKey || inputValue === ""}
            >
                Update parameter
            </button>
        </div>
    );
};

export default SimulationParameters;