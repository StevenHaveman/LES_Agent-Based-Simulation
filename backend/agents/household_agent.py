import random
from backend.agents.resident_agent import Resident
from backend.utilities import gen_random_value

class Household():
    """
    Represents a household unit, containing residents.

    Attributes:
        id (int): Unique identifier for the household.
        residents (list[Resident]): A list of Resident agents belonging to this household.
        solar_panels (bool): Whether the household has decided to install solar panels.
        solarpanel_amount (int): The number of solar panels the household would install (e.g., 6, 8, 10).
        energy_generation (int): Estimated energy generation per panel per year (kWh).
    """
    def __init__(self, solar_panels: bool, id: int):
        """
        Initializes a Household agent.

        Args:
            solar_panels (bool): Initial state of solar panel installation.
            id (int): Unique identifier for the household.
        """
        self.id = id
        self.residents = []

        self.solar_panels = solar_panels
        self.solarpanel_amount = random.choice([6, 8, 10])
        self.energy_generation = random.randint(298, 425)

    def create_residents(self, environment, resident_id: int,  nr_residents: int = 1):
        """
        Creates and adds Resident agents to the household.

        Args:
            environment (Environment): The simulation environment object.
            resident_start_id (int): The starting ID for the new residents.
            nr_residents (int, optional): The number of residents to create. Defaults to 1.

        Returns:
            int: The next available resident ID after creating the residents.
        """
        for _ in range(nr_residents):
            self.residents.append(Resident(resident_id, gen_random_value(0, 1), gen_random_value(0, 2), gen_random_value(0, 2), gen_random_value(0, 2), environment, self))

    def calc_avg_decision(self):
        """
        Determines if the household installs solar panels based on the average
        decision of its residents. If the average score (percentage of residents
        who decided 'yes') is greater than 0.5, the household installs panels.
        """
        total_score = 0
        for resident in self.residents:
            total_score += int(resident.solar_decision)
        avg_score = total_score / len(self.residents)

        if avg_score > 0.5:
            self.solar_panels = True

    def __str__(self):
        """
        Provides a string representation of the Household agent.

        Returns:
            str: A string summarizing the household's status and residents.
        """
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

    