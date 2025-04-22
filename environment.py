import random
from agents.household_agent import Household
from utilities import settings

class Environment:
    def __init__(self, environmental_inf: float = 0.0):
        self.households = []
        self.timestep = 0
        self.environmental_inf = environmental_inf
        self.solarpanel_price = 410 # Gebaseerd op gemiddelde kosten van een zonnepaneel in Nederland
        self.energy_price = 0.32 #https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
    
    def change_influence(self, households: list):
        nr_solarpanels = 0
        for household in households:
            if household.solar_panels:
                nr_solarpanels += 1

        self.environmental_inf = min(nr_solarpanels / (len(households) - 1), 1)
        self.solarpanel_price += round(random.randint(0, 20))
    
    def create_households(self, nr_households: int = 1):
        for i in range(nr_households):
            self.households.append(Household(False, i))

    def distribute_residents(self, nr_residents, nr_households):
        counter = 0
        n_households = len(self.households)
        base_residents = nr_residents // n_households
        remainder = nr_residents % n_households

        for household in self.households:
            household.create_residents(self, counter, base_residents)
            counter += 1
        for _ in range(remainder):
            random.choice(nr_households).create_residents(self, counter, 1)
            counter += 1

    def create_environment(self, nr_residents, nr_households):
        self.create_households(nr_households)
        self.distribute_residents(nr_residents, nr_households)

    def simulate(self, nr_years: int = 1, info_dump: bool = True):
        print(f"--- Starting Simulation ({nr_years} years) ---")
        print(f"Initial State: \n {self}")

        for i in range(nr_years):
            print(f"Year: {i + 1}")
            print(f"Influences: Env={self.environmental_inf:.3f}, Price={self.solarpanel_price}")

            decided_residents = 0
            for household in self.households:
                for resident in household.residents:
                    if not resident.solar_decision: # Only residents without panels reconsider
                        resident.calc_decision(2, info_dump)
                        if resident.solar_decision:
                            decided_residents += 1
                            if info_dump:
                                print(f"Resident {resident.id} wants to get solar panels!")

                household.calc_avg_decision()
                if household.solar_panels and info_dump:
                    print(f"Household {household.id} got solar panels!")

            print(f"\nEnd of Year {i + 1}:")
            print(f"  Decisions this year: {decided_residents}")
            print(f"  Current Environment State: \n {self}") # Show state after year using __str__
            print("-" * 40)

            self.change_influence(self.households)

        print("\n\n" + "-" * 20 + "Simulation Finished" + "-" * 20)

    def data_collction(self):
        timestep_data = {
            "timestep": self.timestep,
        }
    
    def __str__(self):
        """Provides a string representation of the Environment's current state."""
        total_households = len(self.households)
        total_residents = sum(len(h.residents) for h in self.households)
        residents_with_panels = sum(sum(1 for r in h.residents if r.solar_decision) for h in self.households)
        households_with_panels = sum(1 for h in self.households if h.solar_panels or any(r.solar_decision for r in h.residents))
        return (f"  Environment State:\n"
                f"    Total Residents who would like Panels: {residents_with_panels} / {total_residents}\n"
                f"    Households: {households_with_panels} / {total_households} with panels\n"
                f"    Environmental Influence: {self.environmental_inf:.3f}\n"
                f"    Current Solar Panel Price: {self.solarpanel_price}\n") # Use the price variable directly
