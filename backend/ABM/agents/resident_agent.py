from mesa import Agent
import numpy as np
import random
import utilities
from sustainability_packages.solar_panel import SolarPanel

class Resident(Agent):
    """
    Represents an individual resident within a household.

    Attributes:
        unique_id (int): Unique identifier for the resident.
        model (Model): Reference to the Mesa model (serves as the simulation environment).
        household (Household): Reference to the household the resident belongs to.
        income (float): The resident's calculated annual income, rounded to the nearest 100.
        attitude (float): Base attitude towards solar panels (e.g., environmental concern).
        attitude_mod (float): Modifier for the attitude component in decision making.
        subj_norm_mod (float): Modifier for the environmental influence component.
        behavioral_mod (float): Modifier for the behavioral influence component.
        solar_decision (bool): Whether the resident has decided in favor of solar panels. Initially False.
    """

    def __init__(self, id, model, household):
        """
        Initializes a Resident agent.

        Args:
            unique_id (int): Unique identifier for the resident.
            attitude (float): Base attitude towards solar panels.
            attitude_mod (float): Modifier for the attitude component.
            subj_norm_mod (float): Modifier for the environmental influence component.
            behavioral_mod (float): Modifier for the behavioral influence component.
            model (Model): The simulation model object (used instead of 'environment').
            household (Household): The household object this resident belongs to.
        """
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()

        self.unique_id = id
        self.household = household
        self.environment = model

        salary = self.calc_salary()
        self.income = max(round(salary, -2), 0)
        self.subj_norm = {package.name: None for package in self.environment.sustainability_packages}
        self.behavioral_control = {package.name: None for package in self.environment.sustainability_packages}
        
        if self.config_id == 0 or self.config_id == 1:
            self.attitude = utilities.gen_random_value(0, 1)
            self.attitude_mod = utilities.gen_random_value(0, 2)
            self.subj_norm_mod = utilities.gen_random_value(0, 2)
            self.behavioral_mod = utilities.gen_random_value(0, 2)
        else:
            self.attitude = self.config['attitude']
            self.attitude_mod = self.config['attitude_mod']
            self.subj_norm_mod = self.config['subj_norm_mod']
            self.behavioral_mod = self.config['behavioral_mod']

        self.package_decisions = {} # Stores True/False for each package.name
        self.package_subjective_norms = {}

        for package in self.environment.sustainability_packages:
            self.package_decisions[package.name] = False
            self.package_subjective_norms[package.name] = self.config.get('subjective_norm', 0.0)

        self.decision_threshold = self.config['decision_threshold']
        self.calc_subjective_norm()
        self.calc_behavioral_control()



    def calc_salary(self):
        """
        Calculates a resident's salary based on a log-normal distribution
        approximating Dutch income distribution.

        Returns:
            float: A randomly generated salary value.
        """
        median = self.config['median_income']
        sigma_normal = self.config['sigma_normal']
        mu = np.log(median)
        sigma_lognormaal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))
        return np.random.lognormal(mu, sigma_lognormaal)
    
    def calc_behavioral_control(self):
        """
        Calculates the behavioral control for each sustainability package based on
        the resident's income and household characteristics.

        Returns:
            None: Updates the `behavioral_control` attribute in place.
        """
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue

            self.behavioral_control[package.name] = package.calculate_behavioral_influence(self.income, self.household)

    def calc_subjective_norm(self):
        """
        Calculates the subjective norm for each sustainability package based on the
        resident's attitude and the environmental influence.

        Returns:
            None: Updates the `subj_norm` attribute in place.
        """
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue
            
            self.subj_norm[package.name] = self.package_subjective_norms.get(package.name, 0.0)

    def calc_decision(self):
        """
        Calculates whether the resident decides to adopt solar panels based on
        attitude, environmental influence, and behavioral factors, compared against a threshold.

        If the decision score exceeds the threshold, the resident's `solar_decision`
        attribute is set to True. Otherwise, the resident's income might slightly increase.

        Args:
            threshold (float): The value the decision statistic must exceed for a positive decision.
            info_dump (bool, optional): If True, prints debug information. Defaults to False.

        Returns:
            bool | None: True if the decision is positive, None otherwise.
        """
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue
            
            decision_stat = (self.attitude * self.attitude_mod +
                             self.subj_norm[package.name] * package.subj_norm_mod * self.subj_norm_mod +
                             self.behavioral_control[package.name] * self.behavioral_mod) / 6 # Normalize (sum of max mods if all are 2)

            if decision_stat > self.decision_threshold:
                self.package_decisions[package.name] = True
                self.environment.decided_residents_this_step_per_package[package.name] = \
                    self.environment.decided_residents_this_step_per_package.get(package.name, 0) + 1
                
    def collect_resident_data(self):
        agent_data = {
            "id": self.unique_id,
            "household_id": self.household.unique_id,
            "income": self.income,
            "attitude": self.attitude,
            "attitude_mod": self.attitude_mod,
            "subj_norm": self.subj_norm,
            "subj_norm_mod": self.subj_norm_mod,
            "behavioral_control": self.behavioral_control,
            "behavioral_mod": self.behavioral_mod,
            "solar_panels": self.package_decisions.get("Solar Panels", False),
            "heat_pump": self.package_decisions.get("Heat Pump", False),
        }

        return agent_data


    def step(self):
        if not all(self.package_decisions.get(p.name, False) for p in self.environment.sustainability_packages):
            self.calc_decision()
        self.income = int(round(self.income * random.choice(self.config['raise_income']), -1))

        # If all decisions are made, recalculate subjective norm and behavioral control
        self.calc_subjective_norm()
        self.calc_behavioral_control()