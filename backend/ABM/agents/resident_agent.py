import numpy as np
import random


class Resident():
    """
    Represents an individual resident within a household.

    Attributes:
        id (int): Unique identifier for the resident.
        environment (Environment): Reference to the simulation environment.
        household (Household): Reference to the household the resident belongs to.
        income (float): The resident's calculated annual income, rounded to the nearest 100.
        attitude (float): Base attitude towards solar panels (e.g., environmental concern).
        attitude_mod (float): Modifier for the attitude component in decision making.
        environment_mod (float): Modifier for the environmental influence component.
        behavioral_mod (float): Modifier for the behavioral influence component.
        solar_decision (bool): Whether the resident has decided in favor of solar panels. Initially False.
    """
    def __init__(self, id: int, attitude: float, attitude_mod: float, environ_mod: float, behavioral_mod: float, environment, household):
        """
        Initializes a Resident agent.

        Args:
            id (int): Unique identifier for the resident.
            attitude (float): Base attitude towards solar panels.
            attitude_mod (float): Modifier for the attitude component.
            environ_mod (float): Modifier for the environmental influence component.
            behavioral_mod (float): Modifier for the behavioral influence component.
            environment (Environment): The simulation environment object.
            household (Household): The household object this resident belongs to.
        """
        self.id = id
        self.environment = environment
        self.household = household
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
        median = 3300 # Gebaseerd op mediaan inkomen Nederland anno 2024
        sigma_normal = 700 # Gebaseerd op standaarddeviatie inkomen Nederland anno 2024
        mu = np.log(median)
        sigma_lognormaal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))

        return np.random.lognormal(mu, sigma_lognormaal)

    def calculate_behavioral_influence(self, solarpanel_price):
        """
        Calculates the behavioral influence component for the decision-making process.
        This considers the affordability (income vs. total panel cost) and the
        Return on Investment (ROI).

        Args:
            solarpanel_price_total (float): The total cost of the solar panels for the household.

        Returns:
            float: The calculated behavioral influence, clipped between 0 and 1.
        """
        max_diff = 1000
        min_diff = -1000

        difference = self.income - solarpanel_price
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)
        roi = self.calc_roi()
        influence_roi = max(0, 0.25 - 0.025 * roi)  # Maps ROI [0,10] → Influence [0.25, 0]
        
        return np.clip(normalized_diff + influence_roi, 0, 1)


    def calc_roi(self):
        """
        Calculates the simple payback period (Return on Investment time) in years.

        Formula based on: Total Investment / Annual Savings
        https://pure-energie.nl/kennisbank/zonnepanelen-terugverdienen/

        Returns:
            float: The calculated ROI time in years. Returns infinity if savings are zero or negative.
        """
        savings = self.household.energy_generation * self.household.solarpanel_amount * self.environment.energy_price
        return self.environment.solarpanel_price * self.household.solarpanel_amount / savings

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
            return True
        if info_dump:
            print(f"Resident {self.id}, decision stat: {decision_stat}")

        self.income = int(round(self.income * random.choice([1.00, 1.01, 1.02, 1.03, 1.04, 1.05]), -1))
        
    def __str__(self):
        """
        Provides a string representation of the Resident agent.

        Returns:
            str: A string summarizing the resident's attributes.
        """
        return (f"Resident {self.id}: Income={self.income}, Attitude={self.attitude:.2f}, "
                f"Mods(Att={self.attitude_mod:.2f}, Env={self.environment_mod:.2f}, Beh={self.behavioral_mod:.2f}), "
                f"Decided for Solar={self.solar_decision}")