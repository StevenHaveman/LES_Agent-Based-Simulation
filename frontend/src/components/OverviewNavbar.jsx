import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { useSimulationRun } from "../hooks/useSimulationRun.js";
import simulationService from "../services/SimulationService";
import "../styles/OverviewNavbar.css";

/**
 * OverviewNavbar component provides a navigation bar for the simulation overview page.
 * It includes controls for pausing the simulation and adjusting the delay between simulation steps.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title to display in the navigation bar.
 * @returns {JSX.Element} The rendered OverviewNavbar component.
 */
const OverviewNavbar = ({ title, year }) => {
  const seconds = 3;
  // State to track whether the simulation is paused.
  const [paused, setPaused] = useState(false);

  const [delay, setDelay] = useState(seconds);

  const togglePause = async () => {
    const result = await useSimulationRun().togglePause();
    if (result.status === "ok") {
      toast.info(result.message);
      setPaused(result.paused);
    }
  };
  const [showModal, setShowModal] = useState(false);
  const [inputParams, setInputParams] = useState({
    nr_households: 10,
    nr_residents: 10,
    simulation_years: 30,
    seed: 0,
  });

  const [lastParams, setLastParams] = useState(null);

  const openSimulationModal = () => {
    setShowModal(true);
  };

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setInputParams((prev) => ({ ...prev, [name]: value }));
  };

  const startSimulation = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowModal(false);
    setLastParams(inputParams);
    const params = {
      ...inputParams,
      nr_households: Number(inputParams.nr_households),
      nr_residents: Number(inputParams.nr_residents),
      simulation_years: Number(inputParams.simulation_years),
      seed: Number(inputParams.seed),
    };
    const result = await simulationService.startSimulation(params);
    toast.success(result.message || "Simulation started");
  };

  const resetSimulation = async () => {
    if (!lastParams) {
      toast.error("No previous simulation parameters found.");
      return;
    }
    const params = {
      ...lastParams,
      nr_households: Number(lastParams.nr_households),
      nr_residents: Number(lastParams.nr_residents),
      simulation_years: Number(lastParams.simulation_years),
      seed: Number(lastParams.seed),
    };
    const result = await simulationService.startSimulation(params);
    toast.info(result.message || "Simulation reset");
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

    await useSimulationRun.setDelay(newDelay);
  };

  /**
   * Fetches the initial pause status and delay from the controller when the component is mounted.
   * Adds a keydown event listener to toggle the pause state when the 'k' key is pressed.
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      const status = await useSimulationRun().getPauseStatus();
      setPaused(status.paused);

      const delayRes = await useSimulationRun().getSimulationDelay();
      setDelay(delayRes.delay);
    };

    fetchInitialData();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        autoClose={false}
      />
      <div className="overview-navbar">
        <div className="navbar-left">
          <button className="start-button" onClick={openSimulationModal}>
            <span class="material-symbols-outlined">reset_settings</span>
          </button>
          <button className="reset-button" onClick={resetSimulation}>
            <span class="material-symbols-outlined">replay</span>
          </button>
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <form
                style={{
                  background: "white",
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
              <span class="material-symbols-outlined">play_circle</span>
            ) : (
              <span class="material-symbols-outlined">stop_circle</span>
            )}
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

OverviewNavbar.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OverviewNavbar;
