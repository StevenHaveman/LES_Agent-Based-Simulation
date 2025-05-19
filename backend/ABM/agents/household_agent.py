from mesa import Agent
import random
from agents.resident_agent import Resident
import utilities
from solar_panel import SolarPanel

class Household(Agent):
    """
    A Mesa-compatible Household agent that contains Resident agents.

    Attributes:
        unique_id (int): Unique identifier from the Mesa Agent class.
        model (Model): The model in which this agent is embedded.
        residents (list[Resident]): A list of Resident agents belonging to this household.
        solar_panels (bool): Whether the household has decided to install solar panels.
        solarpanel_amount (int): The number of solar panels the household would install (e.g., 6, 8, 10).
        energy_generation (int): Estimated energy generation per panel per year (kWh).
    """
    def __init__(self, model):
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()
        self.residents = []

        self.skip_prev = False
        self.skip_next = False

        self.solar_panels = None
        self.solarpanel_amount = random.choice(self.config['solar_panel_amount_options'])
        self.energy_generation = random.randint(*self.config['energy_generation_range'])

    def create_residents(self, nr_residents: int):
        """
        Create and add Resident agents to the household, and add them to the model schedule.

        Args:
            start_resident_id (int): The starting ID for the new residents.
            nr_residents (int): Number of residents to create.
        Returns:
            int: The next available resident ID.
        """
        for _ in range(nr_residents):
            resident = Resident(
                self.model,
                self  # link naar household
            )
            if self.solar_panels:
                resident.solar_decision = True
            self.residents.append(resident)

    def calc_avg_decision(self):
        """
        Determines if the household installs solar panels based on the average
        decision of its residents. If the average score is greater than 0.5,
        the household installs panels.
        """
        if not self.residents:
            return

        total_score = sum(int(resident.solar_decision) for resident in self.residents)
        avg_score = total_score / len(self.residents)

        if avg_score > self.config['household_decision_threshold']:
            self.solar_panels = True

    def step(self):
        """
        Step function for the household. Executes a step for each resident.
        """
        for resident in self.residents:
            resident.step()

        self.calc_avg_decision()

    def __str__(self):
        """
        Returns a string representation of the household's state, including 
        the number of residents, their decisions, and whether solar panels are installed.
            """ 
        resident_count = len(self.residents)
        residents_with_panels = sum(1 for res in self.residents if res.solar_decision)

        details = (f"Household {self.unique_id}: \n"
                   f"  Solar Panels Installed: {self.solar_panels}\n"
                   f"  Number of Residents: {resident_count}\n"
                   f"  Residents who decided for panels: {residents_with_panels}")
        return details
