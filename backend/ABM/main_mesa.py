
from backend.ABM.environment_mesa import SolarAdoptionModel

graphics_data = []

def run_simulation(nr_households=10, nr_residents=10, simulation_years=30):

    global graphics_data
    graphics_data.clear()

    model = SolarAdoptionModel(nr_households=nr_households, nr_residents=nr_residents)

    for year in range(simulation_years):
        print(f"=== Jaar {year + 1} ===")
        print(f"Current Environment State: ")
        print(model)

        model.step()

        print(f"\nEnd of Year {year + 1}:")
        print(f"  Decisions this year: {model.decided_residents}")
        print(f"  Current Environment State:") # Show state after year using __str__
        print(model)
        print("-" * 40)

        data = model.collect_yearly_data(year)
        graphics_data.append(data)

    return {"message": "Simulation completed"}