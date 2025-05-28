import random
import numpy as np
from sustainability_packages.packages_base import SustainabilityPackage


class HeatPump(SustainabilityPackage):
    def __init__(self, environment):
        super().__init__(
            name="Heat Pump",
            environment=environment,
            price_config_key='heat_pump_price',
            price_increase_config_key='heatpump_price_increase'
        )

    def step(self):
        self.price += round(random.randint(*self.config['heatpump_price_increase']))

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

        difference = income - self.price
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)

        roi = self.calc_roi(household)
        influence_roi = max(0, min(0.25, 0.25 * (1 - roi / 30)))  # Maps ROI [0,30]

        return np.clip(normalized_diff + influence_roi, 0, 1)
    
    def calc_roi(self, household):
        """
        Calculates the simple payback period (Return on Investment time) in years.

        Formula based on: Total Investment / Annual Savings
        https://www.essent.nl/kennisbank/verwarming/wat-zijn-de-voordelen-van-een-verwarmingsinstallatie/terugverdientijd-warmtepomp

        And based on the most commonly used heatpump in The Netherlands, the hybrid heatpump
        https://www.anwb.nl/energie/welke-warmtepomp-kies-ik 

        Returns:
            float: The calculated ROI time in years. Returns infinity if savings are zero or negative.
        """
        gas_costs = household.gas_usage * self.config['gas_price']
        heat_pump_costs = household.heatpump_usage * self.config['energy_price']
        savings = gas_costs - heat_pump_costs

        return self.price / savings