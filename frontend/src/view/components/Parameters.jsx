import React, {useEffect, useState} from "react";
import "../styles/Parameters.css";
import parameterController from "../../controller/ParametersController";

const Parameters = () => {
    const [options, setOptions] = useState([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const opts = await parameterController.getDropdownOptions();
                setOptions(opts);
            } catch (error) {
                console.error("Fout bij ophalen parameters:", error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            const result = await parameterController.updateParameter(selectedKey, parseFloat(inputValue));
            console.log("Update gelukt:", result);
        } catch (error) {
            console.error("Fout bij updaten:", error);
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
                />
            </div>

            <button className="form-button" onClick={handleSubmit}>
                Update parameter
            </button>
        </div>
    );
};

export default Parameters;