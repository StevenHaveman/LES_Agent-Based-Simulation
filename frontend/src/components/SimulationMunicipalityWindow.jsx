import React, { useState } from 'react';
import '../styles/municipalityWindow.css';

const SimulationMunicipalityWindow = () => {
    const [socialNormRadius, setSocialNormRadius] = useState(30);


const applySocialNormRadius = async () => {
    try {
        const response = await fetch(
            "http://localhost:5000/update_social_norm_radius",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    radius: socialNormRadius,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log(
                "Social norm radius updated:",
                data.social_norm_radius
            );
        } else {
            console.error(data.error);
        }

    } catch (error) {
        console.error(
            "Failed to update social norm radius:",
            error
        );
    }
};

    return (
        <>
            <div className="municipality-window">
                <div className="interventions-container">
                    <div className="intervention-group">
                        <h3>Simulation Options</h3>

                        <div className="simulation-option">
                            <label>
                                Social norm radius: {socialNormRadius} meters
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="3000"
                                step="10"
                                value={socialNormRadius}
                                onChange={(e) =>
                                    setSocialNormRadius(Number(e.target.value))
                                }
                            />

                            <button onClick={applySocialNormRadius}>
                                Apply
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default SimulationMunicipalityWindow;