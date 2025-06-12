import React, {useEffect, useState} from "react";
import simulationRunController from "../../controller/SimulationRunController.js";
import "../styles/OverviewNavbar.css";

const OverviewNavbar = ({title}) => {
    const [paused, setPaused] = useState(false);

    const togglePause = async () => {
        const result = await simulationRunController.togglePause();
        if (result.status === "ok") {
            alert(result.message);
            setPaused(result.paused);
        }
    };

    useEffect(() => {
        const fetchPauseStatus = async () => {
            const status = await simulationRunController.getPauseStatus();
            setPaused(status.paused);
        };

        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'k') {
                togglePause();
            }
        };

        fetchPauseStatus();
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <div className="overview-navbar">
                <div className="overview-navbar-title">

                    <img className="overview-logo" src="LES_logo.png" alt="Logo links"/>
                    <div><h1>{title}</h1></div>
                    <img className="overview-logo" src="LES_logo2.png" alt="Logo rechts"/>
                </div>
                <div className="control-bar">
                    <button className="pause-button" onClick={togglePause}>
                        {paused ? "Hervat Simulatie" : "Pauzeer Simulatie"}
                    </button>
                    <select className="delay-select">
                        <option value="3">3 sec</option>
                        <option value="5">5 sec</option>
                        <option value="10">10 sec</option>
                        <option value="0">0</option>

                    </select>
                </div>
            </div>
        </>
    );


};

export default OverviewNavbar;