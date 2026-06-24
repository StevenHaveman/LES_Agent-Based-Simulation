import React from 'react';
import '../styles/municipalityWindow.css';

const MunicipalityWindow = () => {
    return (
        <>
            <div className="municipality-window">
                <div className="interventions-container">
                    <div className="intervention-group">
                        <h3>Municipality Options</h3>

                        <button className="intervention-button">Financial Subsidy</button>

                        <button className="intervention-button">
                            Sustainability Campaign
                        </button>

                        <button className="intervention-button">Renovation Campaign</button>

                        <button className="intervention-button">Announce Heat Grid</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MunicipalityWindow;
