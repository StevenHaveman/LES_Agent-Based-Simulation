import random
from backend.ABM.agents.household_agent import Household

class Environment:
    """
    Manages the simulation environment, containing households and global parameters.

    Attributes:
        households (list[Household]): A list of Household agents in the environment.
        environmental_inf (float): A value representing the social/environmental pressure
                                   or influence to adopt solar panels, typically derived
                                   from the proportion of existing adopters. Normalized to [0, 1].
        solarpanel_price (float): The average price per solar panel.
        energy_price (float): The price of electricity per kWh.
    """
    def __init__(self, environmental_inf: float = 0.0):
        """
        Initializes the Environment.

        Args:
            environmental_inf (float, optional): Initial environmental influence. Defaults to 0.0.
        """
        self.households = []
        self.environmental_inf = environmental_inf
        self.solarpanel_price = 410 # Gebaseerd op gemiddelde kosten van een zonnepaneel in Nederland
        self.energy_price = 0.32 #https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
    
    def change_influence(self, households: list):
        """
        Updates the environmental influence based on the current adoption rate
        of solar panels among households. Also slightly increases solar panel price.

        Args:
            households (list[Household]): The list of households in the simulation.
        """
        nr_solarpanels = 0
        for household in households:
            if household.solar_panels:
                nr_solarpanels += 1

        self.environmental_inf = min(nr_solarpanels / (len(households) - 1), 1)
        self.solarpanel_price += round(random.randint(0, 20))
    
    def create_households(self, nr_households: int = 1):
        """
        Creates a specified number of Household agents and adds them to the environment.

        Args:
            nr_households (int, optional): The number of households to create. Defaults to 1.
        """
        for i in range(nr_households):
            self.households.append(Household(False, i))

    def distribute_residents(self, nr_residents, nr_households):
        """
        Distributes a total number of residents among the specified number of households.
        Attempts to distribute them as evenly as possible, assigning remainders randomly.

        Args:
            nr_residents (int): The total number of residents to create and distribute.
            nr_households_to_distribute_among (int): The number of households to distribute residents into.
                                                    Should be <= total households in environment.
        """
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

    def create_environment(self, nr_residents: int = 1, nr_households: int = 1):
        """
        Sets up the environment by creating households and distributing residents among them.

        Args:
            nr_residents (int, optional): Total number of residents to create. Defaults to 1.
            nr_households (int, optional): Total number of households to create. Defaults to 1.
        """
        self.create_households(nr_households)
        self.distribute_residents(nr_residents, nr_households)

    def simulate(self, nr_years: int = 1, info_dump: bool = True):
        """
        Runs the simulation for a specified number of years.

        In each year:
        1. Each resident (who hasn't decided yet) potentially decides on solar panels.
        2. Each household updates its solar panel status based on resident decisions.
        3. Environmental influence and solar panel prices are updated.

        Args:
            nr_years (int, optional): The number of years to simulate. Defaults to 1.
            info_dump (bool, optional): If True, prints detailed logs for each step. Defaults to True.
        """
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
    
    def __str__(self):
        """
        Provides a string representation of the Environment's current state.

        Returns:
            str: A summary string of the environment status.
        """
        total_households = len(self.households)
        total_residents = sum(len(h.residents) for h in self.households)
        residents_with_panels = sum(sum(1 for r in h.residents if r.solar_decision) for h in self.households)
        households_with_panels = sum(1 for h in self.households if h.solar_panels or any(r.solar_decision for r in h.residents))
        return (f"  Environment State:\n"
                f"    Total Residents who would like Panels: {residents_with_panels} / {total_residents}\n"
                f"    Households: {households_with_panels} / {total_households} with panels\n"
                f"    Environmental Influence: {self.environmental_inf:.3f}\n"
                f"    Current Solar Panel Price: {self.solarpanel_price}\n") # Use the price variable directly
