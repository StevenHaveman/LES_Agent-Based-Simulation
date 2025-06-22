import random
import numpy as np
import utilities
from sustainability_packages.packages_base import SustainabilityPackage


class SolarPanel(SustainabilityPackage):
    """
    Represents Solar Panels as a sustainability package.

    Inherits from SustainabilityPackage and defines specific behaviors for
    solar panels, such as price updates, behavioral influence calculation,
    and ROI calculation.
    """
    def __init__(self, environment):
        """
        Initializes a SolarPanel package instance.

        Args:
            environment (Model): The simulation model/environment.
        """
        super().__init__(
            name="Solar Panel",
            environment=environment,
            price_config_key='solar_panel_price',
            price_increase_config_key='solarpanel_price_increase'
        )

    def step(self):
        """
        Updates the price per solar panel for the current step.

        The price increases by 
        a random amount defined in the configuration.
        """
        self.price += round(random.randint(*self.config['solarpanel_price_increase']))

    def calculate_behavioral_influence(self, income, household):
        """
        Calculates the behavioral influence component for adopting solar panels.

        This considers the affordability (income vs. total panel cost for the
        household's chosen number of panels) and the Return on Investment (ROI).
        The influence is normalized and clipped.

        Args:
            income (float): The resident's annual income.
            household (Household): The household considering solar panels.
                                   Used to get `solarpanel_amount`.

        Returns:
            float: The calculated behavioral influence, clipped between 0 and 1.
        """
        max_diff = self.price / 3 
        min_diff = -(self.price / 3)

        total_panel_cost = self.price * household.solarpanel_amount
        difference = income - total_panel_cost
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)

        roi = self.calc_roi(household)
        # Influence from ROI: higher ROI (longer payback) reduces positive influence.
        # Maps ROI [0, 10] to an influence contribution [0.25, 0].
        # If ROI is 0, contribution is 0.25. If ROI is 10, contribution is 0.
        # If ROI > 10, contribution is < 0 (then clipped by max(0,...)).
        influence_roi = max(0, 0.25 - 0.025 * roi)

        return np.clip(normalized_diff + influence_roi, 0, 1)
    
    def calc_roi(self, household):
        """
        Calculates the simple payback period (Return on Investment time) in years for solar panels.

        Formula: Total Investment / Annual Savings.
        Annual savings are based on energy generation, number of panels, and energy price.

        Args:
            household (Household): The household for which to calculate ROI.
                                   Used to get `energy_generation` and `solarpanel_amount`.

        Returns:
            float: The calculated ROI time in years. Returns float("inf") if
                   annual savings are zero or negative.
        """
        annual_energy_generation_total = household.energy_generation * household.solarpanel_amount
        savings = annual_energy_generation_total * self.environment.energy_price
        cost = self.price * household.solarpanel_amount
        
        if savings <= 0:
            return float("inf")
        return cost / savings
    
    def calc_co2_savings(self, household):
        """
        Calculates annual CO2 savings by displacing grid electricity.
        """
        annual_energy_generation = household.energy_generation * household.solarpanel_amount
        return annual_energy_generation * self.config['CO2_electricity']
