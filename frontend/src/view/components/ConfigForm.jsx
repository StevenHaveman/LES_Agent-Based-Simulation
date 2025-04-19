import React, { useState } from "react";
import "../styles/ConfigForm.css";

const ConfigForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        nr_households: 10,
        nr_residents: 10,
        simulation_years: 30
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Simulatie gestart met:", formData);
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <section className="form-card">
                    <header className="form-header">
                        <h1 className="form-title">Configureer de simulatie</h1>
                        <p className="form-subtitle">Vul de startwaardes in</p>
                    </header>
                    <form onSubmit={handleSubmit} className="form-body">
                        <div className="form-group">
                            <label htmlFor="nr_households" className="form-label">Aantal huishoudens</label>
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
                            <label htmlFor="nr_residents" className="form-label">Aantal bewoners</label>
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
                            <label htmlFor="simulation_years" className="form-label">Simulatieduur (jaren)</label>
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
                            Start simulatie
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ConfigForm;