import React, {useEffect, useState} from "react";
import simulationRunController from "../../controller/SimulationRunController.js";
import "../styles/OverviewNavbar.css";

const OverviewNavbar = ({title}) => {
    const [paused, setPaused] = useState(false);
    const [delay, setDelay] = useState(3);

    const togglePause = async () => {
        const result = await simulationRunController.togglePause();
        if (result.status === "ok") {
            alert(result.message);
            setPaused(result.paused);
        }
    };

    const updateDelay = async (e) => {
        const newDelay = parseInt(e.target.value);
        setDelay(newDelay);


        await simulationRunController.setDelay(newDelay);
    };

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

                    <img className="overview-logo" src="LES_logo.png" alt="Logo links"/>
                    <div><h1>{title}</h1></div>
                    <img className="overview-logo" src="LES_logo2.png" alt="Logo rechts"/>
                </div>
                <div className="control-bar">
                    <button className="pause-button" onClick={togglePause}>
                        {paused ? "Hervat Simulatie" : "Pauzeer Simulatie"}
                    </button>
                    <select className="delay-select" value={delay} onChange={updateDelay}>
                        <option value="3">3 sec</option>
                        <option value="5">5 sec</option>
                        <option value="10">10 sec</option>
                        <option value="0">0 </option>

                    </select>
                </div>
            </div>
        </>
    );


};

export default OverviewNavbar;