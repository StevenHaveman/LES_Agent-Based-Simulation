import random
from agents.household_agent import Household

class Environment:
    def __init__(self, environmental_inf: float = 0.0):
        self.households = []
        self.environmental_inf = environmental_inf
        self.solarpanel_price = [2600, 3300, 3900] # Gebaseerd op gemiddelde kosten van 6-10 zonnepanelen

    
    def change_influence(self, households: list):
        nr_solarpanels = 0
        for household in households:
            if household.solar_panels:
                nr_solarpanels += 1

        self.environmental_inf = nr_solarpanels / (len(households) * 2)
        self.solarpanel_price = [price + round(random.randint(0, 100)) for price in self.solarpanel_price]
    
    def create_households(self, nr_households: int = 1):
        for i in range(nr_households):
            self.households.append(Household(False, i))

    def distribute_residents(self, nr_residents, nr_households):
        counter = 0
        n_households = len(self.households)
        base_residents = nr_residents // n_households
        remainder = nr_residents % n_households

        for household in self.households:
            household.create_residents(counter, base_residents)
            counter += 1
        for _ in range(remainder):
            random.choice(nr_households).create_residents(counter, 1)
            counter += 1

    def create_environment(self, nr_residents: int = 1, nr_households: int = 1):
        self.create_households(nr_households)
        self.distribute_residents(nr_residents, nr_households)

    def simulate(self, nr_years: int = 1, info_dump: bool = True):
        print(f"--- Starting Simulation ({nr_years} years) ---")
        print(f"Initial State: \n {self}")

        for i in range(nr_years):
            print(f"Year: {i + 1}")
            self.change_influence(self.households)
            print(f"Influences: Env={self.environmental_inf:.3f}, Price={self.solarpanel_price}")

            decided_residents = 0
            for household in self.households:
                for resident in household.residents:
                    if not resident.solar_decision: # Only residents without panels reconsider
                        decision_made = resident.calc_decision(0.5, self, info_dump)
                        if decision_made:
                            decided_residents += 1
                            if info_dump:
                                print(f"Resident {resident.id} decided to get solar panels!")

            print(f"\nEnd of Year {i + 1}:")
            print(f"  Decisions this year: {decided_residents}")
            print(f"  Current Environment State: \n {self}") # Show state after year using __str__
            print("-" * 40)

        print("\n\n" + "-" * 20 + "Simulation Finished" + "-" * 20)
    
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
