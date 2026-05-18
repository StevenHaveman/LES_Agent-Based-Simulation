from mesa import Agent
import numpy as np
import random
import utilities

class Resident(Agent):
    """
    Represents an individual resident within a household.

    Residents make individual decisions about adopting sustainability packages,
    influenced by their income, attitude, subjective norms, and perceived
    behavioral control.

    """
    def __init__(self, id, model, household,survey_profile):
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

        # Survey-based profile for attitude.
        self.attitude = survey_profile["attitude"]

        # salary = self.calc_salary()
        self.decision_threshold = self.config['decision_threshold']
        self.income = 0

        # RAA NORM STRUCTURE
        self.injunctive_norm = {p.name: 0.0 for p in self.environment.sustainability_packages}
        self.descriptive_norm = {p.name: 0.0 for p in self.environment.sustainability_packages}
        self.perceived_norm = {p.name: 0.0 for p in self.environment.sustainability_packages}

        # BEHAVIORAL CONTROL (PBC)
        # Survey-based perceived behavioral control (PBC) from cluster profiles
        self.survey_pbc = survey_profile["pbc"]

        # INTENTION SYSTEM
        self.intentions = {p.name: 0.0 for p in self.environment.sustainability_packages}

        # self.intention_threshold = self.config.get('intention_threshold',self.decision_threshold)
        self.intention_threshold = 0.7 # This is a new parameter that determines how high the intention needs to be for the resident to decide to adopt a package. We can experiment with different values for this to see how it affects adoption rates.

        # ATTITUDE AND SENSITIVITY
        if self.config_id in (0, 1):
            self.attitude_sensitivity = utilities.gen_random_value(0, 2)
            self.norm_sensitivity = utilities.gen_random_value(0, 2)
            self.control_sensitivity = utilities.gen_random_value(0, 2)
        else:
            self.attitude_sensitivity = self.config['attitude_sensitivity']
            self.norm_sensitivity = self.config['subj_norm_sensitivity']
            self.control_sensitivity = self.config['control_sensitivity']

        # DECISIONS STATE
        self.package_decisions = {
            p.name: False for p in self.environment.sustainability_packages
        }
                
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
        """
        Calculates the intention to adopt each sustainability package based on attitude,
        subjective norm, and perceived behavioral control, applying the respective sensitivities and weights from the configuration.
        """
        for package in self.environment.sustainability_packages:
            if self.package_decisions.get(package.name, False):
                continue



            # make the the attitude, subjective norm, and behavioral control components for the agent and package, applying the respective modifiers
            attitude_part = self.attitude * self.attitude_sensitivity
            norm_part = (self.perceived_norm[package.name] * package.norm_influence_strength * self.norm_sensitivity)

            # Household-level feasibility (financial/technical constraints)
            actual_control = self.household.actual_control[package.name]
            # Combine perceived control (survey) with actual control
            combined_control = (0.6 * self.survey_pbc + 0.4 * actual_control)
            # Apply agent-specific sensitivity to control
            control_part = (combined_control * self.control_sensitivity)

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


    def collect_resident_data(self):
        agent_data = {
            "id": self.unique_id,
            "household_id": self.household.unique_id,
            "income": self.income,
            "attitude": self.attitude,
            "attitude_sensitivity": self.attitude_sensitivity,

            # perceived norm (psychological perception)
            "perceived_norm": self.perceived_norm,
            "norm_sensitivity": self.norm_sensitivity,

            # perceived behavioral control (survey-based PBC)
            "survey_pbc": self.survey_pbc,
            "control_sensitivity": self.control_sensitivity,

            # NEW: actual household constraint (optional but very useful for analysis)
            "household_actual_control": {
                p.name: self.household.actual_control[p.name]
                for p in self.environment.sustainability_packages
            }
        }

        for package in self.environment.sustainability_packages:
            agent_data[package.name] = self.package_decisions[package.name]

        return agent_data

    def step(self):
        """
        Step function for the resident.

        - First: form intentions (RAA model)
        - Second: decide behavior based on intention threshold
        - Third: update income dynamics
        """

        # Only act if not all packages are already decided
        if not all(self.package_decisions.get(p.name, False)
                for p in self.environment.sustainability_packages):

            # 1. Calculate psychological drivers
            self.calc_intention()

            # 2. Decision-making (intention → behavior)
            for package in self.environment.sustainability_packages:

                if self.package_decisions.get(package.name, False):
                    continue

                intention = self.intentions[package.name]

                # intention threshold check (RAA decision rule)
                if intention > self.intention_threshold:

                    # optional: lightweight feasibility gate (household-level constraint)
                    actual_control = self.household.actual_control[package.name]

                    if actual_control > 0.2:  # can later move to config
                        self.package_decisions[package.name] = True

                        self.environment.decided_residents_this_step_per_package[package.name] = \
                            self.environment.decided_residents_this_step_per_package.get(package.name, 0) + 1

        # 3. income dynamics (keeps agent evolving over time)
        self.income = int(
            round(self.income * np.random.choice(self.config['raise_income']), -1)
        )