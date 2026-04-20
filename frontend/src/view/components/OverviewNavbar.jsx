import React, { useEffect, useState } from "react";
import simulationRunController from "../../controller/SimulationRunController.js";
import "../styles/OverviewNavbar.css";

/**
 * OverviewNavbar component provides a navigation bar for the simulation overview page.
 * It includes controls for pausing the simulation and adjusting the delay between simulation steps.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display in the navigation bar.
 * @returns {JSX.Element} The rendered OverviewNavbar component.
 */
const OverviewNavbar = ({ title }) => {
    // State to track whether the simulation is paused.
    const [paused, setPaused] = useState(false);
    // State to track the delay between simulation steps in seconds.
    const [delay, setDelay] = useState(3);

    /**
     * Toggles the pause state of the simulation by interacting with the controller.
     * Updates the paused state and displays an alert with the result message.
     */
    const togglePause = async () => {
        const result = await simulationRunController.togglePause();
        if (result.status === "ok") {
            alert(result.message);
            setPaused(result.paused);
        }
    };

    /**
     * Updates the delay between simulation steps by interacting with the controller.
     * Sets the new delay value in the state.
     *
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the delay dropdown.
     */
    const updateDelay = async (e) => {
        const newDelay = parseInt(e.target.value);
        setDelay(newDelay);

        await simulationRunController.setDelay(newDelay);
    };

    /**
     * Fetches the initial pause status and delay from the controller when the component is mounted.
     * Adds a keydown event listener to toggle the pause state when the 'k' key is pressed.
     */
    useEffect(() => {
        const fetchInitialData = async () => {
            const status = await simulationRunController.getPauseStatus();
            setPaused(status.paused);

            const delayRes = await simulationRunController.getDelay();
            setDelay(delayRes.delay);
        };

        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'k') {
                togglePause();
            }
        };

        fetchInitialData();
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <div className="overview-navbar">
                <div className="overview-navbar-title">
                    <img className="overview-logo" src="LES_logo.png" alt="Logo links" />
                    <div><h1>{title}</h1></div>
                    <img className="overview-logo" src="LES_logo2.png" alt="Logo rechts" />
                </div>
                <div className="control-bar">
                    <button className="pause-button" onClick={togglePause}>
                        {paused ? "Hervat Simulatie" : "Pauzeer Simulatie"}
                    </button>
                    <h5> Delay: </h5>
                    <select className="delay-select" value={delay} onChange={updateDelay}>
                        <option value="3">3 sec</option>
                        <option value="5">5 sec</option>
                        <option value="10">10 sec</option>
                        <option value="0">0 sec</option>
                    </select>
                </div>
            </div>
        </>
    );
};

export default OverviewNavbar;