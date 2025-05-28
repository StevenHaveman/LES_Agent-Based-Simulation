import random

import numpy as np
from environment import Environment
import utilities

# TODO DENK DAT DIT IN EEN DATA CLASSE MOET GAAN GEBEUREN ZODDAT DE DATA IN DE GUI KAN WORDEN GETOONT EN HET OP EEN PLEK IS.
graphics_data = []
households_data = []

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30, seed=None): 
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

    households_data.clear()
    households_data.extend(model.collect_household_information())
    return {"message": "Simulation completed"}

if __name__ == "__main__":
    config_id, config = utilities.choose_config()
    simulation_result = run_simulation(config['nr_households'], config['nr_residents'], config['simulation_years'])
    print(simulation_result["message"])

        