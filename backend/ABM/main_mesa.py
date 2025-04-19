# main_mesa.py
from backend.ABM.environment_mesa import SolarAdoptionModel

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30):
    model = SolarAdoptionModel(nr_households=nr_households, nr_residents=nr_residents)

    simulation_output = []

    for year in range(simulation_years):
        print(f"=== Jaar {year+1} ===")
        print(f"Environmental Influence: {model.environmental_inf}")
        print(f"Solar Panel Price: {model.solarpanel_price:.2f}")

        print(f"\nEnd of Year {year}:")
        print(f"  Decisions this year: {model.decided_residents}")
        print(f"  Current Environment State: \n") # Show state after year using __str__
        print(model)
        # print(model)
        print("-" * 40)

        model.step()



    return simulation_output