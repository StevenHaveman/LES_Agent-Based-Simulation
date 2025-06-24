import React, { useEffect, useState } from "react";
import "../styles/Parameters.css";
import  simulationParametersController from "../../controller/SimulationParametersController.js";

const SimulationParameters = () => {
    const [options, setOptions] = useState([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [inputValue, setInputValue] = useState("");


    useEffect(() => {
        fetchOptions();
    }, []);


    const fetchOptions = async () => {
        try {
            const opts = await simulationParametersController.fetchParameters();
            setOptions(opts);
        } catch (error) {
            console.error("Fout bij ophalen parameters:", error);
        }
    };


    const handleSubmit = async () => {
        try {
            const newValue = parseFloat(inputValue);
            const result = await simulationParametersController.updateParameter(selectedKey, newValue);

            alert(`Parameter "${selectedKey}" is bijgewerkt naar waarde: ${newValue}`);


            await fetchOptions();


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

export default SimulationParameters