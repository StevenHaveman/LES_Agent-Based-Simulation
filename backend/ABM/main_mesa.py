from backend.ABM.environment_mesa import SolarAdoptionModel

def main():
    model = SolarAdoptionModel(nr_households=10, nr_residents=10)
    for year in range(30):
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

if __name__ == "__main__":
    main()
