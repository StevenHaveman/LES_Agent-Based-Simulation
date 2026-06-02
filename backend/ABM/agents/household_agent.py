from mesa import Agent
import random
from agents.resident_agent import Resident
import utilities

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
        self.original_co2_emissions = self.get_initial_co2_emissions()
        self.current_co2_emissions = self.original_co2_emissions # This will be updated as packages are installed and CO2 savings are realized.
        self.co2_saved_yearly = 0
        self.renovation_costs_spend  = 0
        self.current_kpi_level = self.convert_energy_label_to_kpi_level()
        self.residents = []
        self.package_installations = {package.name: False for package in self.model.sustainability_packages}
        self.renovation_cooldown = 0
        self.active_package = None  # Track the currently active package for this household, if any.
        self.actual_control = {package.name: 0.0 for package in self.model.sustainability_packages} # This will be calculated based on the household's attributes and the requirements of each package, and can be used in the decision-making process of the residents.

        # Flags for "Direct" subjective norm, per package
        self.skip_prev_flags = {} # {package_name: False/True}
        self.skip_next_flags = {} # {package_name: False/True}

    def convert_energy_label_to_kpi_level(self):
        label = self.gis_attributes.get("Energielabel")
        return self.ENERGY_LABEL_TO_KPI.get(label)
    
    def convert_kpi_level_to_energy_label(self, kpi_level):
        return self.KPI_TO_ENERGY_LABEL.get(kpi_level)
    
    def get_household_income(self):
        return sum(res.income for res in self.residents)
    
    # 3. ACTUAL CONTROL
    def calculate_actual_control(self):

        household_income = self.get_household_income()
        action_score = self.get_household_action_score()

        for package in self.model.sustainability_packages:

            self.actual_control[package.name] = (
                package.calculate_behavioral_influence(
                    income=household_income,
                    household=self,
                    action_score=action_score
                )
            )

    def update_cooldown(self):
        if self.renovation_cooldown > 0:
            # print(f"Household {self.unique_id} is in renovation cooldown for {self.renovation_cooldown} more years.")
            self.renovation_cooldown = max(0, self.renovation_cooldown - 1)


    def choose_household_package(self):

        if not self.residents:
            return

        if self.renovation_cooldown > 0:
            return

        best_package = None
        best_score = 0
        best_rank = 0

        for package in self.model.sustainability_packages:

            if package.baseline_level != self.current_kpi_level:
                continue

            supporters = sum(
                1 for res in self.residents
                if res.package_decisions.get(package.name, False)
            )

            support_score = supporters / len(self.residents)

            avg_intention = sum(
                res.intentions[package.name] for res in self.residents
            ) / len(self.residents)

            #INTENTION GATE
            if avg_intention < self.config.get("intention_threshold", 0.7):
                continue

            actual_control_score = self.actual_control[package.name]

            print(self.actual_control)

            if actual_control_score < self.config.get("actual_control_threshold", 0.7):
                continue

            #4. ACTION SCORE
            final_score = (
                0.5 * avg_intention +
                0.3 * support_score + # Remove support score.
                0.2 * actual_control_score
            )

            target_rank = self.LEVEL_RANK[package.target_level]

            if (
                final_score > best_score or
                (final_score == best_score and target_rank > best_rank)
            ):
                best_score = final_score
                best_rank = target_rank
                best_package = package

        # 5. ACTION (Y/N)
        if (best_package and best_score >= self.config['household_decision_threshold']):

            if (self.active_package is not None and self.active_package.name == best_package.name):
                return

            if self.active_package is not None:
                self.package_installations[self.active_package.name] = False

            self.renovation_cooldown = self.config.get("renovation_cooldown", 0)
            self.package_installations[best_package.name] = True
            self.active_package = best_package
            self.renovation_costs_spend += best_package.price

            self.current_kpi_level = best_package.target_level
            self.gis_attributes["Energielabel"] = (
                self.convert_kpi_level_to_energy_label(self.current_kpi_level)
            )

            self.current_co2_emissions = best_package.co2_output

    def get_initial_co2_emissions(self):
        """Estimates the initial annual CO2 emissions of the household based on its energy label and other GIS attributes.
        This is a simplified estimation and can be refined with more detailed data and calculations."""
        current_kpi = self.convert_energy_label_to_kpi_level()

        matching_packages = [
            package for package in self.model.sustainability_packages
            if package.baseline_level == current_kpi
        ]

        if not matching_packages:
            return 0

        # Takes the maximum CO2 emissions among the matching packages as a proxy for the household's initial emissions, since the packages are designed to improve upon that baseline.
        return max(package.co2_output for package in matching_packages)

    def calc_co2_emissions(self,):

        pass

    # 2. Action score. 
    def get_household_action_score(self):
        if not self.residents:
            return 0
        return sum(r.action_score for r in self.residents) / len(self.residents)
    
    def step(self):
        """
        Step function for the household.

        This method first executes a step for each resident in the household.
        Then, for each sustainability package available in the environment,
        it re-evaluates the household's decision to install that package.
        Also calculates the total amount of CO2 saved by each package.
        """
        self.calculate_actual_control()

        self.update_cooldown() # Update renovation cooldown at the beginning of the step, so that the household can make a new decision after the cooldown period has passed.

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