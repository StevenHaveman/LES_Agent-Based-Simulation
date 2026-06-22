import React from 'react';
import '../styles/municipalityWindow.css';

const SimulationMunicipalityWindow = () => {
    return (
        <>
            <div className="municipality-window">
                <div className="interventions-container">
                    <div className="intervention-group">
                        <h3>Simulation Options</h3>

                        <button className="intervention-button">Announce Heat Grid</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SimulationMunicipalityWindow;
