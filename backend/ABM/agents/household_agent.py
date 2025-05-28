from mesa import Agent
import random
from agents.resident_agent import Resident
import utilities
from sustainability_packages.solar_panel import SolarPanel

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
        self.environment = model
        self.package_installations = {}

        # Flags for "Direct" subjective norm, per package
        self.skip_prev_flags = {} # {package_name: False/True}
        self.skip_next_flags = {} # {package_name: False/True}

        self.solarpanel_amount = random.choice(self.config['solar_panel_amount_options'])
        self.energy_generation = random.randint(*self.config['energy_generation_range'])
        self.gas_usage = random.randint(*self.config['yearly_gas_usage'])
        self.heatpump_usage = random.randint(*self.config['yearly_heatpump_usage'])

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
            for package_name, is_installed in self.package_installations.items():
                if is_installed:
                    resident.package_decisions[package_name] = True
            self.residents.append(resident)

    def calc_avg_decision(self, package):
        """
        Determines if the household installs solar panels based on the average
        decision of its residents. If the average score is greater than 0.5,
        the household installs panels.
        """
        if not self.residents:
            return

        if self.package_installations.get(package.name, False):
            return

        num_positive_decisions = sum(
            1 for res in self.residents if res.package_decisions.get(package.name, False)
        )
        avg_score = num_positive_decisions / len(self.residents)

        if avg_score >= self.config['household_decision_threshold']:
            self.package_installations[package.name] = True

    def step(self):
        """
        Step function for the household. Executes a step for each resident.
        """
        for resident in self.residents:
            resident.step()
        
        for package in self.environment.sustainability_packages:
            self.calc_avg_decision(package)

    def __str__(self):
        """
        Returns a string representation of the household's state, including 
        the number of residents, their decisions, and whether solar panels are installed.
            """ 
        resident_count = len(self.residents)
        details = f"Household {self.unique_id}:\n"
        for package_name, installed in self.package_installations.items():
            details += f"  {package_name} Installed: {installed}\n"
            decided_residents = sum(1 for res in self.residents if res.package_decisions.get(package_name, False))
            details += f"  Residents who decided for {package_name}: {decided_residents}/{resident_count}\n"
        details += f"  Number of Residents: {resident_count}\n"
        return details
