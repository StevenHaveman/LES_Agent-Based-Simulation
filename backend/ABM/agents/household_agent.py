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
    # Define a ranking for KPI levels to facilitate comparisons (e.g., for feasibility checks).
    LEVEL_RANK = {"Bad": 1, "Poor": 2, "Medium": 3, "OK": 4, "Good": 5}


    def __init__(self, id, model, gis_attributes=None):
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()
        self.unique_id = id
        self.KPI_TO_ENERGY_LABEL = {"Bad": "F","Poor": "D","Medium": "C", "OK": "B","Good": "A"}
        self.ENERGY_LABEL_TO_KPI = {"G": "Bad","F": "Bad", "E": "Poor","D": "Poor", "C": "Medium", "B": "OK", "A": "Good"}
        self.gis_attributes = gis_attributes or {}
        self.current_kpi_level = self.convert_energy_label_to_kpi_level()
        self.residents = []
        self.package_installations = {package.name: False for package in self.model.sustainability_packages}
        self.active_package = None  # Track the currently active package for this household, if any.

        # Flags for "Direct" subjective norm, per package
        self.skip_prev_flags = {} # {package_name: False/True}
        self.skip_next_flags = {} # {package_name: False/True}

        self.solarpanel_amount = random.choice(self.config['solar_panel_amount_options'])
        self.energy_generation = random.randint(*self.config['energy_generation_range'])
        self.gas_usage = random.randint(*self.config['yearly_gas_usage'])
        self.energy_usage = random.randint(*self.config['yearly_energy_usage'])
        self.heatpump_usage = random.randint(*self.config['yearly_heatpump_usage'])
        self.co2_saved_yearly = 0

    def convert_energy_label_to_kpi_level(self):
        label = self.gis_attributes.get("Energielabel")
        return self.ENERGY_LABEL_TO_KPI.get(label)
    
    def convert_kpi_level_to_energy_label(self, kpi_level):
        return self.KPI_TO_ENERGY_LABEL.get(kpi_level)

    # This function is now replaced by the choose_household_package function, 
    # which looks at all packages and chooses the one with the highest support that meets the decision threshold.
    # def calc_avg_decision(self, package): 
    #     """
    #     Determines if the household installs a given sustainability package based
    #     on the average decision of its residents.

    #     If the proportion of residents who have decided in favor of the package
    #     meets or exceeds the household's decision threshold, the household
    #     installs the package. This check is skipped if the package is already
    #     installed or if the household has no residents.

    #     Args:
    #         package (SustainabilityPackage): The sustainability package being considered.
    #     """
    #     if not self.residents:
    #         return
        
    #     if self.package_installations.get(package.name, False):
    #         return

    #     num_positive_decisions = sum(1 for res in self.residents if res.package_decisions.get(package.name, False))
    #     avg_score = num_positive_decisions / len(self.residents)

    #     if avg_score >= self.config['household_decision_threshold']:
    #         # turn off the currently active package if there is one.
    #         if self.active_package is not None:
    #             self.package_installations[self.active_package.name] = False

    #         # turn on the new package
    #         self.package_installations[package.name] = True
    #         self.active_package = package

    #         # KPI + energy label
    #         self.current_kpi_level = package.target_level
    #         self.gis_attributes["Energielabel"] = self.convert_kpi_level_to_energy_label(self.current_kpi_level)

    #         # CO2 update
    #         self.model.current_co2 -= package.calc_co2_savings(self)

    def choose_household_package(self):
        """
        Determines which sustainability package to install based on the support of residents and the household's decision threshold.
        """

        if not self.residents:
            return

        best_package = None
        best_score = 0
        best_rank = 0

        for package in self.model.sustainability_packages:

            supporters = sum(
                1 for res in self.residents
                if res.package_decisions.get(package.name, False)
            )

            score = supporters / len(self.residents)
            target_rank = self.LEVEL_RANK[package.target_level]
            
            # choose the package with:
            # 1. highest support
            # 2. if support is equal, the one with the highest target level
            if (
                score > best_score or
                (score == best_score and target_rank > best_rank)
            ):
                best_score = score
                best_rank = target_rank
                best_package = package

        # Install the best package if it meets the household decision threshold
        if (best_package and best_score >= self.config['household_decision_threshold']):
            # turn off the currently active package if there is one.
            if self.active_package is not None:
                self.package_installations[self.active_package.name] = False

            # install new package
            self.package_installations[best_package.name] = True
            self.active_package = best_package

            # KPI + label update
            self.current_kpi_level = best_package.target_level

            self.gis_attributes["Energielabel"] = (self.convert_kpi_level_to_energy_label(self.current_kpi_level))

            # CO2
            self.model.current_co2 -= (best_package.calc_co2_savings(self))

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
        
        # After all residents have made their decisions, determine which package the household installs based on the support of its residents and the decision threshold.
        self.choose_household_package()

        # yearly CO2 savings calculation for the active package, if any.
        if self.active_package is not None:
            self.co2_saved_yearly += (self.active_package.calc_co2_savings(self))




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