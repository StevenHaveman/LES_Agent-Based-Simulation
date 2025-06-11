import random

import numpy as np
from environment import Environment
import utilities

import os
import glob

# TODO DENK DAT DIT IN EEN DATA CLASSE MOET GAAN GEBEUREN ZODDAT DE DATA IN DE GUI KAN WORDEN GETOONT EN HET OP EEN PLEK IS.
graphics_data = []
households_data = []

def initialize_data_collection(model: Environment):
    save_folder = config['data_save_folder']
    os.makedirs(save_folder, exist_ok=True)

    # Find existing files matching the pattern
    existing_files = glob.glob(os.path.join(save_folder, "simulation_data_*.json"))
    run_number = len(existing_files) + 1
    file_name = os.path.join(save_folder, f"simulation_data_{run_number:03d}.json")

    # Write the data structure to a Json file
    model.setup_data_structure(file_name)

    return file_name
    

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30, seed=None): 
    global graphics_data
    global households_data

    if seed is None:
        seed = random.randint(0, 2**32 - 1)

    random.seed(seed)
    np.random.seed(seed)
    
    graphics_data.clear()

    model = Environment(nr_households=nr_households, nr_residents=nr_residents)

    # Setup data collection structure to a dedicated json file
    if config['collect_data']:
        file_name = initialize_data_collection(model)

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

        # Export data to JSON file if configured
        if config['collect_data']:
            model.export_data(file_name, year + 1)

    households_data.clear()
    households_data.extend(model.collect_household_information())
    return {"message": "Simulation completed"}

if __name__ == "__main__":
    config_id, config = utilities.choose_config()
    simulation_result = run_simulation(config['nr_households'], config['nr_residents'], config['simulation_years'])
    print(simulation_result["message"])

        