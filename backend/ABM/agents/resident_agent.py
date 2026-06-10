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
        self.cluster_type = survey_profile["cluster_type"] # This is the cluster type from the survey profiles, which can be used for analysis and potentially for influencing behavior in more complex ways in the future.
        self.action_score = survey_profile["action_score"] # This is the action score from the survey profiles, which can be used for analysis and potentially for influencing behavior in more complex ways in the future.
        # Survey-based profile for attitude.
        self.attitude = survey_profile["attitude_score"]

        # salary = self.calc_salary()
        self.decision_threshold = self.config['decision_threshold']
        self.income = 0

        # gets updated each step based on the current adoption levels in the environment.
        self.perceived_norm = 0.0

        # BEHAVIORAL CONTROL (PBC)
        # Survey-based perceived behavioral control (PBC) from cluster profiles
        self.survey_pbc = survey_profile["pbc_score"]

        # INTENTION SYSTEM
        self.intentions = 0.0

        # resident is open to renvovation.
        self.wants_to_renovate = False

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




    #1. INTENTION (RAA – resident level) ## TODO 
    def calc_intention(self):
        """
        Calculates the resident's intention based on
        attitude, perceived norm and PBC.
        """

        attitude_part = self.attitude * self.attitude_sensitivity

        norm_part = (
            self.perceived_norm
            * self.norm_sensitivity
        )

        control_part = (
            self.survey_pbc
            * self.control_sensitivity
        )

        w_att = self.config.get("weight_attitude", 1.0)
        w_norm = self.config.get("weight_norm", 1.0)
        w_control = self.config.get("weight_control", 1.0)

        total_weight = w_att + w_norm + w_control

        self.intention = (
            w_att * attitude_part +
            w_norm * norm_part +
            w_control * control_part
        ) / total_weight

        return self.intention


    def collect_resident_data(self):
        agent_data = {
            "id": self.unique_id,
            "household_id": self.household.unique_id,
            "cluster_type": self.cluster_type,
            "income": self.income, # change to household level income if we want to analyze household-level constraints more directly
            "attitude": self.attitude,
            "attitude_sensitivity": self.attitude_sensitivity,

            # perceived norm (psychological perception)
            "perceived_norm": self.perceived_norm,
            "norm_sensitivity": self.norm_sensitivity,

            # perceived behavioral control (survey-based PBC)
            "survey_pbc": self.survey_pbc,
            "control_sensitivity": self.control_sensitivity,

            # action score from cluster 
            "action_score": self.action_score,

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

            # Calculate intention
            self.calc_intention()

            # Resident expresses support for renovation
            self.wants_to_renovate = (
                self.intention >= self.intention_threshold
            )

            # gradual learning / social adaptation
            self.attitude += 0.01 * (1 - self.attitude)
            self.survey_pbc += 0.01 * (1 - self.survey_pbc)

            # optional income dynamics
            # self.income = int(round(self.income * np.random.choice(self.config['raise_income']), -1))