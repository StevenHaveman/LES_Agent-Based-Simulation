import random
import numpy as np
from sustainability_packages.packages_base import SustainabilityPackage


class HeatPump(SustainabilityPackage):
    """
    Represents a Heat Pump as a sustainability package.

    Inherits from SustainabilityPackage and defines specific behaviors for
    heat pumps, such as price updates, behavioral influence calculation,
    and ROI calculation.
    """
    def __init__(self, environment):
        """
        Initializes a HeatPump package instance.

        Args:
            environment (Model): The simulation model/environment.
        """
        super().__init__(
            name="Heat Pump",
            environment=environment,
            price_config_key='heat_pump_price',
            price_increase_config_key='heatpump_price_increase'
        )

    def step(self):
        """
        Updates the price of the heat pump for the current step.

        The price increases by a random amount defined in the configuration.
        """
        self.price += round(random.randint(*self.config['heatpump_price_increase']))

    def calculate_behavioral_influence(self, income, household):
        """
        Calculates the behavioral influence component for adopting a heat pump.

        This considers the affordability (income vs. heat pump cost) and the
        Return on Investment (ROI). The influence is normalized and clipped.

        Args:
            income (float): The resident's annual income.
            household (Household): The household considering the heat pump.

        Returns:
            float: The calculated behavioral influence, clipped between 0 and 1.
        """
        max_diff = 1000
        min_diff = -1000

        difference = income - self.price # Assumes one heat pump unit
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)

        roi = self.calc_roi(household)
        # Influence from ROI: higher ROI (longer payback) reduces positive influence.
        # Maps ROI [0, 30] to a contribution. If ROI is 0, contribution is 0.25.
        # If ROI is 30, contribution is 0. If ROI > 30, contribution is < 0 (then clipped by max(0,...)).
        influence_roi = max(0, min(0.25, 0.25 * (1 - roi / 30)))

        return np.clip(normalized_diff + influence_roi, 0, 1)
    
    def calc_roi(self, household):
        """
        Calculates the simple payback period (Return on Investment time) in years for a heat pump.

        Formula: Total Investment / Annual Savings.
        Annual savings are calculated as the difference between current gas costs
        and projected electricity costs with a heat pump.

        Args:
            household (Household): The household for which to calculate ROI.

        Returns:
            float: The calculated ROI time in years. Returns float("inf") if
                   annual savings are zero or negative.
        """
        gas_costs = household.gas_usage * self.config['gas_price']
        heat_pump_costs = household.heatpump_usage * self.config['energy_price']
        savings = gas_costs - heat_pump_costs

        if savings <= 0:
            return float("inf")
        return self.price / savings