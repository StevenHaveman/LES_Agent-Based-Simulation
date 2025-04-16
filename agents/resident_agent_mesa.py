from mesa import Agent
import numpy as np
import random

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
        environment_mod (float): Modifier for the environmental influence component.
        behavioral_mod (float): Modifier for the behavioral influence component.
        solar_decision (bool): Whether the resident has decided in favor of solar panels. Initially False.
    """

    def __init__(self, attitude, attitude_mod, environ_mod, behavioral_mod, model, household):
        """
        Initializes a Resident agent.

        Args:
            unique_id (int): Unique identifier for the resident.
            attitude (float): Base attitude towards solar panels.
            attitude_mod (float): Modifier for the attitude component.
            environ_mod (float): Modifier for the environmental influence component.
            behavioral_mod (float): Modifier for the behavioral influence component.
            model (Model): The simulation model object (used instead of 'environment').
            household (Household): The household object this resident belongs to.
        """
        super().__init__(model)
        self.household = household
        self.environment = model

        salary = self.calc_salary()
        self.income = max(round(salary, -2), 0)

        self.attitude = attitude
        self.attitude_mod = attitude_mod
        self.environment_mod = environ_mod
        self.behavioral_mod = behavioral_mod
        self.solar_decision = False

    def calc_salary(self):
        """
        Calculates a resident's salary based on a log-normal distribution
        approximating Dutch income distribution.

        Returns:
            float: A randomly generated salary value.
        """
        median = 3300  # Based on Dutch median income (2024)
        sigma_normal = 700  # Based on Dutch standard deviation (2024)
        mu = np.log(median)
        sigma_lognormaal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))
        return np.random.lognormal(mu, sigma_lognormaal)
    
    def calc_decision(self, threshold, info_dump=False):
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

        behavioral_inf = self.calculate_behavioral_influence(self.environment.solarpanel_price * self.household.solarpanel_amount)
        decision_stat = self.attitude * self.attitude_mod + self.environment.environmental_inf * self.environment_mod + behavioral_inf * self.behavioral_mod

        if decision_stat > threshold:
            self.solar_decision = True
            self.environment.decided_residents += 1
            return True
        if info_dump:
            print(f"Resident {self.id}, decision stat: {decision_stat}")

        self.income = int(round(self.income * random.choice([1.00, 1.01, 1.02, 1.03, 1.04, 1.05]), -1))

    def step(self):
        if not self.solar_decision:
            # print(f"Resident {self.unique_id} is considering solar panels.")
            self.calc_decision(threshold=2, info_dump=False)

    def calc_roi(self):
        """
        Calculates the simple payback period (Return on Investment time) in years.

        Formula based on: Total Investment / Annual Savings
        https://pure-energie.nl/kennisbank/zonnepanelen-terugverdienen/

        Returns:
            float: The calculated ROI time in years. Returns infinity if savings are zero or negative.
        """
        savings = self.household.energy_generation * self.household.solarpanel_amount * self.environment.energy_price
        cost = self.environment.solarpanel_price * self.household.solarpanel_amount
        return cost / savings if savings > 0 else float("inf")
    
    

    def calculate_behavioral_influence(self, solarpanel_price):
        """
        Calculates the behavioral influence component for the decision-making process.
        This considers the affordability (income vs. total panel cost) and the
        Return on Investment (ROI).

        Args:
            solarpanel_price (float): The total cost of the solar panels for the household.

        Returns:
            float: The calculated behavioral influence, clipped between 0 and 1.
        """
        max_diff = 1000
        min_diff = -1000
        difference = self.income - solarpanel_price
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)
        roi = self.calc_roi()
        influence_roi = max(0, 0.25 - 0.025 * roi)  # Maps ROI [0,10] → Influence [*_
        return np.clip(normalized_diff + influence_roi, 0, 1)
