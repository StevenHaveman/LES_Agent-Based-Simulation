from environment_mesa import SolarAdoptionModel

def main():
    model = SolarAdoptionModel(nr_households=2, nr_residents=10)
    for year in range(30):
        print(f"=== Jaar {year+1} ===")
        model.step()

if __name__ == "__main__":
    main()
