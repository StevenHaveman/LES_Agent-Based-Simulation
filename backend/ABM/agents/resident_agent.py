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

    """
    def __init__(self, id, model, household):
        """
        Initializes a Resident agent.

        Args:
            model (Model): The simulation model object this agent belongs to.
            household (Household): The household object this resident belongs to.
        """
        super().__init__(model)
        self.config_id, self.config = utilities.choose_config()

        self.unique_id = id
        self.household = household
        self.environment = model

        salary = self.calc_salary()
        self.decision_threshold = self.config['decision_threshold']
        self.income = max(round(salary, -2), 0)
        self.subj_norm = {package.name: None for package in self.environment.sustainability_packages}
        self.behavioral_control = {package.name: None for package in self.environment.sustainability_packages}
        self.intentions = {package.name: 0.0 for package in self.environment.sustainability_packages}
        self.intention_threshold = self.config.get('intention_threshold', self.decision_threshold)
        
        if self.config_id in (0, 1):
            self.attitude = utilities.gen_random_value(0, 1)
            self.attitude_sensitivity = utilities.gen_random_value(0, 2)
            self.subj_norm_sensitivity = utilities.gen_random_value(0, 2)
            self.control_sensitivity = utilities.gen_random_value(0, 2)
        else:
            self.attitude = self.config['attitude']
            self.attitude_sensitivity = self.config['attitude_sensitivity']
            self.subj_norm_sensitivity = self.config['subj_norm_sensitivity']
            self.control_sensitivity = self.config['control_sensitivity']
            

        self.package_decisions = {} # Stores True/False for each package.name
        self.package_subjective_norms = {}

        for package in self.environment.sustainability_packages:
            self.package_decisions[package.name] = False
            self.package_subjective_norms[package.name] = self.config.get('subjective_norm', 0.0)

        self.calc_subjective_norm()
        self.calc_behavioral_control()

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
        sigma_lognormal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))
        return np.random.lognormal(mu, sigma_lognormal)
    
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
                
    def calc_behavior(self): # New voor RAA model
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue

            intention = self.intentions[package.name]

            if intention > self.intention_threshold:
                if self.check_actual_control(package):
                    self.package_decisions[package.name] = True
                    self.environment.decided_residents_this_step_per_package[package.name] = \
                        self.environment.decided_residents_this_step_per_package.get(package.name, 0) + 1

    def calc_intention(self): # New voor RAA model
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue

            # make the the attitude, subjective norm, and behavioral control components for the agent and package, applying the respective modifiers
            attitude_part = self.attitude * self.attitude_sensitivity
            norm_part = (self.subj_norm[package.name] * package.subj_norm_mod * self.subj_norm_sensitivity)
            control_part = (self.behavioral_control[package.name] * self.control_sensitivity)

            # get the weights for each component from the config, or default to 1.0 if not specified
            w_att = self.config.get("weight_attitude", 1.0)
            w_norm = self.config.get("weight_norm", 1.0)
            w_control = self.config.get("weight_control", 1.0)

            # Calculate total weight for normalization
            total_weight = w_att + w_norm + w_control

            # Calculate intention as a weighted average of the three components
            intention = (w_att * attitude_part + w_norm * norm_part + w_control * control_part) / total_weight

            # update the intention for this package
            self.intentions[package.name] = intention
                

    def check_actual_control(self, package):
        """
        Checks if the resident is actually able to adopt the package,
        based on real-world constraints.
        """
        return package.is_feasible(self.income, self.household, self.environment) #Function exists but wel need to be reworked with new packages in mind.

    def collect_resident_data(self):
        agent_data = {
            "id": self.unique_id,
            "household_id": self.household.unique_id,
            "income": self.income,
            "attitude": self.attitude,
            "attitude_mod": self.attitude_sensitivity,
            "subj_norm": self.subj_norm,
            "subj_norm_mod": self.subj_norm_sensitivity,
            "behavioral_control": self.behavioral_control,
            "behavioral_mod": self.control_sensitivity,
        }
        for package in self.environment.sustainability_packages:
            agent_data[package.name] = self.package_decisions[package.name]

        return agent_data

def step(self):
    """
    Step function for the resident.

    The resident first forms intentions based on attitude, subjective norm,
    and perceived behavioral control. Then, actual behavior is determined
    based on intention and actual control.

    After decision-making, income is updated.
    """

    # Only calculate intentions and behavior if not all packages have been decided on
    if not all(self.package_decisions.get(p.name, False) for p in self.environment.sustainability_packages):
        self.calc_intention()
        self.calc_behavior()

    self.income = int(round(self.income * np.random.choice(self.config['raise_income']), -1))

    # If all decisions are made, recalculate subjective norm and behavioral control
    self.calc_subjective_norm()
    self.calc_behavioral_control()