import React from 'react';
import '../styles/municipalityWindow.css';

const MunicipalityWindow = () => {
    return (
        <>
            <div className="municipality-window">
                <div className="interventions-section">
                    <h2>Municipality Interventions</h2>
                    <div className="intervention-buttons">

                        <button className="intervention-button">
                            Sustainability Information Campaign
                        </button>

                        <button className="intervention-button">
                            Renovation Information Campaign
                        </button>
          
                    </div>
                </div>
            </div>
        </>
    );
};

export default MunicipalityWindow;
