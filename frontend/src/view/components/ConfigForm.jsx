import React, {useState} from "react";
import "../styles/ConfigForm.css";
import configFormController from "../../controller/ConfigFormController.js";
import { useNavigate } from "@tanstack/react-router";


const ConfigForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nr_households: 10,
        nr_residents: 10,
        simulation_years: 30
    });
    const navigate = useNavigate();


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await configFormController.startSimulation(formData);


            console.log("Simulation succesvol:");
            await navigate({to: "/overview"});
        } catch (error) {
            alert("Something went wrong");
            console.error("Simulation went wrong", error);
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
                            <label htmlFor="nr_residents" className="form-label">Number of residents</label>
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
                            <label htmlFor="simulation_years" className="form-label">Duration of Simulation(years)</label>
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