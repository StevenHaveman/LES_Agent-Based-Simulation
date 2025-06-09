from mesa import Agent
import numpy as np
import random
import utilities
from sustainability_packages.solar_panel import SolarPanel

class Resident(Agent):
    """
    Represents an individual resident within a household.

    Residents make individual decisions about adopting sustainability packages,
    influenced by their income, attitude, subjective norms, and perceived
    behavioral control.

    Attributes:
        unique_id (int): Unique identifier for the resident, inherited from Mesa Agent.
        model (Model): Reference to the Mesa model (simulation environment).
        household (Household): Reference to the household the resident belongs to.
        config_id (int): Identifier for the chosen configuration.
        config (dict): The configuration dictionary.
        environment (Model): Reference to the simulation model (same as model).
        income (float): The resident's calculated annual income, rounded to the nearest 100.
        subj_norm (float): Base subjective norm value from configuration.
        attitude (float): Base attitude towards sustainability packages (e.g., environmental concern).
        attitude_mod (float): Modifier for the attitude component in decision making.
        subj_norm_mod (float): Modifier for the subjective norm component in decision making.
        behavioral_mod (float): Modifier for the behavioral influence component in decision making.
        package_decisions (dict): Stores decision status (True/False) for each
                                  sustainability package (e.g., {package_name: bool}).
        package_subjective_norms (dict): Stores the current subjective norm value
                                         for each package (e.g., {package_name: float}).
        decision_threshold (float): The threshold a decision statistic must exceed
                                    for a positive decision towards a package.
    """
    def __init__(self, model, household):
        """
        Initializes a Resident agent.

        Args:
            model (Model): The simulation model object this agent belongs to.
            household (Household): The household object this resident belongs to.
        """
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()


        self.household = household
        self.environment = model

        salary = self.calc_salary()
        self.income = max(round(salary, -2), 0)
        self.subj_norm = self.config['subjective_norm']
        
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

    def calc_salary(self):
        """
        Calculates a resident's salary based on a log-normal distribution
        approximating Dutch income distribution from the configuration.

        Returns:
            float: A randomly generated salary value.
        """
        median = self.config['median_income']
        sigma_normal = self.config['sigma_normal']
        mu = np.log(median)
        sigma_lognormaal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))
        return np.random.lognormal(mu, sigma_lognormaal)
    
    def calc_decision(self):
        """
        Calculates whether the resident decides to adopt available sustainability
        packages based on attitude, subjective norm, and behavioral factors,
        compared against a decision threshold.

        If the decision score for a package exceeds the threshold, the resident's
        decision for that package is set to True. This method iterates through
        all sustainability packages not yet adopted by the resident.
        """
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue

            behavioral_inf = package.calculate_behavioral_influence(self.income, self.household)
            
            current_subj_norm_for_package = self.package_subjective_norms.get(package.name, 0.0)
            
            decision_stat = (self.attitude * self.attitude_mod +
                             current_subj_norm_for_package * package.subj_norm_mod * self.subj_norm_mod +
                             behavioral_inf * self.behavioral_mod) / 6 # Normalize (sum of max mods if all are 2)

            if decision_stat > self.decision_threshold:
                self.package_decisions[package.name] = True
                self.environment.decided_residents_this_step_per_package[package.name] = \
                    self.environment.decided_residents_this_step_per_package.get(package.name, 0) + 1

    def step(self):
        """
        Step function for the resident.

        The resident first attempts to make decisions on any sustainability packages
        they haven't already decided on. After decision-making, their income is
        updated with a random raise.
        """
        if not all(self.package_decisions.get(p.name, False) for p in self.environment.sustainability_packages):
            self.calc_decision()
        self.income = int(round(self.income * random.choice(self.config['raise_income']), -1))