import random
import numpy as np
import utilities


class SolarPanel():
    def __init__(self, environment):
        self.config_id, self.config = utilities.choose_config()
        self.price = self.config['solar_panel_price']
        self.environment = environment

    def step(self):
        self.price += round(random.randint(*self.config['solarpanel_price_increase']))

    def calculate_behavioral_influence(self, income, household):
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

        difference = income - self.price * household.solarpanel_amount
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)

        roi = self.calc_roi(household)
        influence_roi = max(0, 0.25 - 0.025 * roi)  # Maps ROI [0,10] → Influence [*_

        return np.clip(normalized_diff + influence_roi, 0, 1)
    
    def calc_roi(self, household):
        """
        Calculates the simple payback period (Return on Investment time) in years.

        Formula based on: Total Investment / Annual Savings
        https://pure-energie.nl/kennisbank/zonnepanelen-terugverdienen/

        Returns:
            float: The calculated ROI time in years. Returns infinity if savings are zero or negative.
        """
        savings = household.energy_generation * household.solarpanel_amount * self.environment.energy_price
        cost = self.price * household.solarpanel_amount
        return cost / savings if savings > 0 else float("inf")