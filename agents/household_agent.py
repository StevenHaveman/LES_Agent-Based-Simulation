import random
from agents.agent import Agent
from agents.resident_agent import Resident
from utilities import gen_random_value

class Household(Agent):
    def __init__(self, solar_panels: bool, id: int):
        super().__init__()
        self.id = id
        self.solar_panels = solar_panels
        self.residents = []

    def create_residents(self, environment, resident_id: int,  nr_residents: int = 1):
        for i in range(nr_residents):
            self.residents.append(Resident(resident_id, gen_random_value(-0.1, 0.3), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2), environment))

    def __str__(self):
        """Provides a string representation of the Household."""
        resident_count = len(self.residents)
        residents_with_panels = sum(1 for res in self.residents if res.solar_decision)
        has_panels = self.solar_panels or (residents_with_panels > 0)

        details = (f"Household {self.id}: \n"
                   f"  Solar Panels Installed: {has_panels}\n"
                   f"  Number of Residents: {resident_count}\n"
                   f"  Residents who decided for panels: {residents_with_panels}")
        # Optionally add details for each resident (can be verbose for many residents)
        # for resident in self.residents:
        #     details += f"\n    - {resident}" # Uses Resident's __str__
        return details

    