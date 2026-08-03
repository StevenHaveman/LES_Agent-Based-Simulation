"""
Main simulation controller.

This module is responsible for running the agent-based simulation and exposing
simulation data for the Flask API. It creates the simulation environment,
advances the model year by year, and stores data used by the frontend for
visualisation and analysis.
"""

import glob
import os
import random
import time

import numpy as np

from environment import Environment
from shared_state import get_delay


# =============================================================================
# Global simulation state
# =============================================================================

graphics_data = []
"""Yearly aggregated simulation data used for charts."""

households_data = []
"""Detailed household information for the current simulation year."""

households_historical_data = []
"""Historical household information for all simulated years."""

kpi_data = {}
"""Latest Key Performance Indicators (KPIs)."""

simulation_paused = False
"""Indicates whether the simulation is currently paused."""

model = None
"""Reference to the currently active Environment instance."""


# =============================================================================
# Helper functions
# =============================================================================

def initialize_data_collection(model: Environment, config: dict) -> str:
    """
    Prepare the JSON output file for simulation data collection.

    A unique filename is generated based on the number of existing simulation
    output files in the configured data directory.

    Args:
        model: The simulation environment.
        config: Simulation configuration.

    Returns:
        str: Path to the JSON output file.
    """
    save_folder = config["data_save_folder"]
    os.makedirs(save_folder, exist_ok=True)

    existing_files = glob.glob(
        os.path.join(save_folder, "simulation_data_*.json")
    )

    run_number = len(existing_files) + 1

    file_name = os.path.join(
        save_folder,
        f"simulation_data_{run_number:03d}.json"
    )

    model.setup_data_structure(file_name)

    return file_name


def toggle_simulation_pause() -> bool:
    """
    Toggle the paused state of the simulation.

    Returns:
        bool: True if the simulation is now paused, otherwise False.
    """
    global simulation_paused

    simulation_paused = not simulation_paused
    return simulation_paused


def is_simulation_paused() -> bool:
    """
    Check whether the simulation is currently paused.

    Returns:
        bool: True if paused, otherwise False.
    """
    return simulation_paused


# =============================================================================
# Simulation
# =============================================================================

def run_simulation(config: dict, simulation_years: int = 30):
    """
    Run the agent-based simulation.

    The simulation is executed year by year. After every simulation step,
    aggregated statistics, household information and KPIs are collected for
    use by the frontend.

    Args:
        config: Simulation configuration.
        simulation_years: Number of simulation years to execute.
    """
    global graphics_data
    global households_data
    global households_historical_data
    global kpi_data
    global model

    if config is None:
        raise ValueError("A simulation configuration must be provided.")

    seed = config.get("seed")

    if seed is None:
        seed = random.randint(0, 2**32 - 1)

    random.seed(seed)
    np.random.seed(seed)

    graphics_data.clear()
    households_data.clear()
    households_historical_data.clear()
    kpi_data.clear()

    model = Environment(config=config)

    file_name = None
    if config.get("collect_data", False):
        file_name = initialize_data_collection(model, config)

    for year in range(simulation_years):

        while is_simulation_paused():
            time.sleep(1)

        model.current_year = year + 1

        print(f"=== Year {model.current_year} ===")

        yearly_data = model.collect_start_of_year_data(model.current_year)

        model.step()

        model.collect_end_of_year_data(yearly_data)

        graphics_data.append(yearly_data)

        kpi_data.clear()
        kpi_data.update(model.collect_kpi_data())

        print("Collected KPIs:")
        for name, value in kpi_data.items():
            print(f"  {name}: {value}")

        if file_name is not None:
            model.export_data(file_name, model.current_year)

        household_info = model.collect_household_information()

        households_data.clear()
        households_data.extend(household_info)

        households_historical_data.append(
            {
                "year": model.current_year,
                "households": household_info,
            }
        )

        print(
            f"Collected household data for "
            f"{len(households_data)} households."
        )

        time.sleep(get_delay())