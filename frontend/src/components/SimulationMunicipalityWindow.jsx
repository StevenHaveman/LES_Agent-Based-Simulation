import React, { useState, useEffect } from 'react';
import '../styles/MunicipalityWindow.css';

const SimulationMunicipalityWindow = () => {
    // Radius the running simulation actually uses; null until loaded.
    const [socialNormRadius, setSocialNormRadius] = useState(null);

    useEffect(() => {
        const loadRadius = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/social_norm_radius'
                );
                const data = await response.json();
                if (response.ok) {
                    setSocialNormRadius(Number(data.social_norm_radius));
                }
            } catch (error) {
                console.error(
                    'Failed to load social norm radius:',
                    error
                );
            }
        };

        loadRadius();
    }, []);

    const applySocialNormRadius = async () => {
        try {
            const response = await fetch(
                'http://localhost:5000/update_social_norm_radius',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        radius: socialNormRadius,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log(
                    'Social norm radius updated:',
                    data.social_norm_radius
                );
            } else {
                console.error(data.error);
            }

        } catch (error) {
            console.error(
                'Failed to update social norm radius:',
                error
            );
        }
    };

    return (
        <div className="panel">
            <h3 className="panel-title">Simulation Options</h3>

            <div className="panel-section">
                <div className="panel-label-row">
                    <label className="panel-label" htmlFor="socialNormRadius">
                        Social norm radius
                    </label>
                    <span className="panel-value">
                        {socialNormRadius === null ? '–' : `${socialNormRadius} m`}
                    </span>
                </div>

                <input
                    id="socialNormRadius"
                    className="panel-range"
                    type="range"
                    min="10"
                    max="3000"
                    step="10"
                    value={socialNormRadius ?? 10}
                    disabled={socialNormRadius === null}
                    onChange={(e) =>
                        setSocialNormRadius(Number(e.target.value))
                    }
                />

                <div className="panel-range-scale" aria-hidden="true">
                    <span>10 m</span>
                    <span>3000 m</span>
                </div>

                <button
                    type="button"
                    className="panel-button panel-button-wide"
                    onClick={applySocialNormRadius}
                    disabled={socialNormRadius === null}
                >
                    Apply
                </button>
            </div>
        </div>
    );
};

export default SimulationMunicipalityWindow;
