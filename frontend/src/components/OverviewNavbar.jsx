import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import '../styles/OverviewNavbar.css';
import useOverviewNavbarLogic from '../hooks/useOverviewNavbarLogic';
import HelpModal from './HelpModal.jsx';

/**
 * OverviewNavbar component provides a navigation bar for the simulation overview page.
 * It includes controls for pausing the simulation and adjusting the delay between simulation steps.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display in the navigation bar.
 * @returns {JSX.Element} The rendered OverviewNavbar component.
 */
const OverviewNavbar = ({ title, year }) => {
    const {
        paused,
        delay,
        showModal,
        setShowModal,
        inputParams,
        handleParamChange,
        startSimulation,
        resetSimulation,
        togglePause,
        updateDelay,
        openSimulationModal,
    } = useOverviewNavbarLogic();

        const [helpOpen, setHelpOpen] = useState(false);
        const showHelp = () => setHelpOpen(true);
        const helpHtml = `
                <p>The INSIGHT-model is an Integrated Neighborhood Simulation for Informing Green Housing Transitions.</p>
                <p>The model combines research insights on:</p>
                <ul>
                    <li>Technical building performance before and after renovations.</li>
                    <li>Anonymized social data gathered through surveys.</li>
                    <li>Public information about the housing stock in a specific neighborhood.</li>
                </ul>
                <p>While the model displays houses on a real-life map, the resident data and assumptions are not linked to the actual location where the houses are plotted.</p>
                <p>For more information about the project: <a href="https://www.internationalhu.com/research/projects/sustainable-and-social-local-energy-systems" target="_blank" rel="noopener noreferrer">https://www.internationalhu.com/research/projects/sustainable-and-social-local-energy-systems</a></p>
                <p>Contact information: <a href="mailto:steven.haveman@hu.nl">steven.haveman@hu.nl</a></p>
                <p>The model has been developed for research purposes in the 'LES-project' - (Sustainable and Social Local Energy Systems project).</p>
                <p>This project is financed by NSFC and NWO to stimulate collaboration between two countries. Knowledge institutions from both countries will work with societal partners from public, semi-public and private organisations, to increase the societal relevance and impact of their research..</p>
        `;

    return (
        <>
            <ToastContainer position="top-right" hideProgressBar={false} />
            <div className="overview-navbar">
                <div className="navbar-left">
                    <button className="start-button" onClick={openSimulationModal} title="Start Simulation">
                        <span className="material-symbols-outlined">reset_settings</span>
                    </button>
                    <button className="reset-button" onClick={resetSimulation} title="Reset Simulation">
                        <span className="material-symbols-outlined">replay</span>
                    </button>
                    {showModal && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000,
                            }}
                        >
                            <form
                                style={{
                                    background: 'white',
                                    padding: 24,
                                    borderRadius: 8,
                                    minWidth: 320,
                                }}
                                onSubmit={startSimulation}
                            >
                                <h3>Start New Simulation</h3>
                                {/* <label>
                                            Households:
                                            <input type="number" name="nr_households" value={inputParams.nr_households} onChange={handleParamChange} min={1} required />
                                        </label><br />
                                        <label>
                                            Residents:
                                            <input type="number" name="nr_residents" value={inputParams.nr_residents} onChange={handleParamChange} min={1} required />
                                        </label><br /> */}
                                <label>
                                    Years:
                                    <input
                                        type="number"
                                        name="simulation_years"
                                        value={inputParams.simulation_years}
                                        onChange={handleParamChange}
                                        min={1}
                                        required
                                    />
                                </label>
                                <br />
                                <label>
                                    Seed:
                                    <input
                                        type="number"
                                        name="seed"
                                        value={inputParams.seed}
                                        onChange={handleParamChange}
                                        required
                                    />
                                </label>
                                <br />
                                <button type="submit">Start</button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ marginLeft: 8 }}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="overview-navbar-title">
                    <img className="overview-logo" src="LES_logo.png" alt="Logo links" />
                    <div>
                        <h1>{title}</h1>
                    </div>
                    <img
                        className="overview-logo"
                        src="LES_logo2.png"
                        alt="Logo rechts"
                    />
                </div>
                <div className="control-bar">
                    <span className="simulation-year">Simulation Year: {year}</span>
                    <button className="pause-button" onClick={togglePause}>
                        {paused ? (
                            <span className="material-symbols-outlined" title="Play">
                                play_circle
                            </span>
                        ) : (
                            <span className="material-symbols-outlined" title="Pause">
                                stop_circle
                            </span>
                        )}
                    </button>
                    <h5> Delay: </h5>
                    <select className="delay-select" value={delay} onChange={updateDelay}>
                        <option value="3">3 sec</option>
                        <option value="5">5 sec</option>
                        <option value="10">10 sec</option>
                        <option value="0">0 sec</option>
                    </select>
                    <button className="help-button" onClick={showHelp} title="Help" style={{ marginLeft: 8 }}>
                        <span className="material-symbols-outlined">help</span>
                    </button>
                    <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} html={helpHtml} />
                </div>
            </div>
        </>
    );
};

OverviewNavbar.propTypes = {
    title: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OverviewNavbar;
