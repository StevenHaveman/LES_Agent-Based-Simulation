from mesa import Agent
import random
from agents.resident_agent import Resident
import utilities
from sustainability_packages.solar_panel import SolarPanel

class Household(Agent):
    """
    A Mesa-compatible Household agent that contains Resident agents.

    This agent represents a household unit in the simulation, capable of making
    collective decisions on adopting sustainability packages based on the
    preferences of its resident members.

    Attributes:
        unique_id (int): Unique identifier from the Mesa Agent class.
        model (Model): The model in which this agent is embedded.
        config_id (int): Identifier for the chosen configuration.
        config (dict): The configuration dictionary.
        residents (list[Resident]): A list of Resident agents belonging to this household.
        environment (Model): Reference to the simulation model (same as model).
        package_installations (dict): A dictionary tracking installed sustainability
                                      packages (e.g., {"Solar Panel": True, "Heat Pump": False}).
        skip_prev_flags (dict): Flags for "Direct" subjective norm calculation,
                                indicating if influence from the previous house for a
                                package has been accounted for. {package_name: bool}.
        skip_next_flags (dict): Flags for "Direct" subjective norm calculation,
                                indicating if influence from the next house for a
                                package has been accounted for. {package_name: bool}.
        solarpanel_amount (int): The number of solar panels the household would install
                                 if they decide to adopt solar panels (e.g., 6, 8, 10).
        energy_generation (int): Estimated energy generation per solar panel per year (kWh).
        gas_usage (int): Annual gas usage of the household (kWh).
        heatpump_usage (int): Annual electricity usage by a heat pump if installed (kWh).
    """
    def __init__(self, id, model):
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()
        self.unique_id = id
        self.residents = []
        self.environment = model
        self.package_installations = {}

        # Flags for "Direct" subjective norm, per package
        self.skip_prev_flags = {} # {package_name: False/True}
        self.skip_next_flags = {} # {package_name: False/True}

        self.solarpanel_amount = random.choice(self.config['solar_panel_amount_options'])
        self.energy_generation = random.randint(*self.config['energy_generation_range'])
        self.gas_usage = random.randint(*self.config['yearly_gas_usage'])
        self.energy_usage = random.randint(*self.config['yearly_energy_usage'])
        self.heatpump_usage = random.randint(*self.config['yearly_heatpump_usage'])
        self.co2_saved_yearly = 0

    def create_residents(self, nr_residents: int, id_counter: int) -> int:
        """
        Create and add Resident agents to the household.

        Newly created residents inherit the household's current package installation
        status as their initial decision state for those packages.

        Args:
            nr_residents (int): Number of residents to create for this household.
        """
        for _ in range(nr_residents):
            resident = Resident(
                id_counter,
                self.model,
                self  # link naar household
            )
            id_counter += 1

            for package_name, is_installed in self.package_installations.items():
                if is_installed:
                    resident.package_decisions[package_name] = True
            self.residents.append(resident)

        return id_counter

    def calc_avg_decision(self, package):
        """
        Determines if the household installs a given sustainability package based
        on the average decision of its residents.

        If the proportion of residents who have decided in favor of the package
        meets or exceeds the household's decision threshold, the household
        installs the package. This check is skipped if the package is already
        installed or if the household has no residents.

        Args:
            package (SustainabilityPackage): The sustainability package being considered.
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

            self.environment.current_co2 -= package.calc_co2_savings(self)

    def calc_co2_emissions(self,):
        co2_electricity = self.energy_usage * self.config['CO2_electricity']
        co2_gas = self.gas_usage * self.config['CO2_gas']

        return co2_electricity + co2_gas

    def step(self):
        """
        Step function for the household.

        This method first executes a step for each resident in the household.
        Then, for each sustainability package available in the environment,
        it re-evaluates the household's decision to install that package.
        Also calculates the total amount of CO2 saved by each package.
        """
        for resident in self.residents:
            resident.step()
        
        for package in self.environment.sustainability_packages:
            self.calc_avg_decision(package)
            self.co2_saved_yearly += package.calc_co2_savings(self)


    def __str__(self):
        """
        Returns a string representation of the household's state.

        Includes the household's ID, the installation status of each sustainability
        package, the number of residents who decided for each package, and the
        total number of residents.

        Returns:
            str: A string detailing the household's current status.
        """ 
        resident_count = len(self.residents)
        details = f"Household {self.unique_id}:\n"
        for package_name, installed in self.package_installations.items():
            details += f"  {package_name} Installed: {installed}\n"
            decided_residents = sum(1 for res in self.residents if res.package_decisions.get(package_name, False))
            details += f"  Residents who decided for {package_name}: {decided_residents}/{resident_count}\n"
        details += f"  Number of Residents: {resident_count}\n"
        return details