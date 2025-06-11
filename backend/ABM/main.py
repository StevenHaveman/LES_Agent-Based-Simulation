"""
Main script for running the agent-based model simulation.

This script initializes the simulation environment and runs it for a specified
number of years. It collects data for visualization and detailed household
information at the end of the simulation.
"""
import random

import numpy as np
from environment import Environment
import utilities
import config
import time
# Global lists to store data from the simulation for potential use by an API or UI.
graphics_data = [] # Stores yearly aggregated data for charts/graphs.
households_data = [] # Stores detailed household information at the end of the simulation.

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30, seed=None): 
    """
    Runs the agent-based model simulation.

    Initializes the model with the given parameters, runs it for the specified
    number of simulation years, and collects data.

    Args:
        nr_households (int, optional): The number of households in the simulation.
                                       Defaults to 10.
        nr_residents (int, optional): The total number of residents, distributed
                                      among households. Defaults to 10.
        simulation_years (int, optional): The number of years the simulation
                                          will run. Defaults to 30.
        seed (int, optional): Seed for random number generators for reproducibility.
                              If None, a random seed is used. Defaults to None.

    Returns:
        dict: A dictionary containing a message indicating simulation completion.
    """
    global graphics_data
    global households_data

    if seed is None:
        seed = random.randint(0, 2**32 - 1)

    random.seed(seed)
    np.random.seed(seed)
    
    graphics_data.clear()

    model = Environment(nr_households=nr_households, nr_residents=nr_residents)


    for year in range(simulation_years):
        print(f"=== Year {year + 1} ===")
        print("Current Environment State (begin):")
        print(model)

        data = model.collect_start_of_year_data(year + 1)

        model.step()

        print(f"\nEnd of Year {year + 1}:")
        for package_name, count in model.decided_residents_this_step_per_package.items():
            print(f"  Decisions this year for {package_name}: {count}")

        print("  Current Environment State (end):")
        print(model)
        print("-" * 40)

        model.collect_end_of_year_data(data)
        graphics_data.append(data)

        time.sleep(5)


    households_data.clear()
    households_data.extend(model.collect_household_information())
    return {"message": "Simulation completed"}

if __name__ == "__main__":
    config_id, config = utilities.choose_config()
    simulation_result = run_simulation(config['nr_households'], config['nr_residents'], config['simulation_years'], config['seed'])
    print(simulation_result["message"])

        