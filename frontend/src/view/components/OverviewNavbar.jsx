import React, { useEffect, useState } from "react";
import simulationRunController from "../../controller/SimulationRunController.js";
import "../styles/OverviewNavbar.css";

const OverviewNavbar = ({ title }) => {
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
            <div className="navbar">
                <img className="logo" src="LES_logo.png" alt="Logo links"/>
                <div><h1>{title}</h1></div>
                <img className="logo" src="LES_logo2.png" alt="Logo rechts"/>
            </div>
            <button className="pause-button" onClick={togglePause}>
                {paused ? "Hervat Simulatie" : "Pauzeer Simulatie"}
            </button>
        </>
    );
};

export default OverviewNavbar;