from environment import SolarAdoptionModel
import utilities

# TODO DENK DAT DIT IN EEN DATA CLASSE MOET GAAN GEBEUREN ZODDAT DE DATA IN DE GUI KAN WORDEN GETOONT EN HET OP EEN PLEK IS.
graphics_data = []
households_data = []

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30):
    global graphics_data
    global households_data

    graphics_data.clear()

    model = SolarAdoptionModel(nr_households=nr_households, nr_residents=nr_residents)

    for year in range(simulation_years):
        print(f"=== Year {year + 1} ===")
        print("Current Environment State (begin):")
        print(model)

        data = model.collect_start_of_year_data(year + 1)

        model.step()

        print(f"\nEnd of Year {year + 1}:")
        print(f"  Decisions this year: {model.decided_residents}")
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
    nr_streets = run_simulation(config['nr_households'], config['nr_residents'], config['simulation_years'])

