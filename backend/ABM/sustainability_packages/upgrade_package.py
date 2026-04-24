import random
import numpy as np

class UpgradePackage:
    """
    Represents an upgrade package for sustainability improvements.
    Attributes:
        package_id (str): Unique identifier for the upgrade package.
        from_level (str): The current level of the household's sustainability.
        to_level (str): The target level of sustainability after applying the package.
        investment_cost (float): The upfront cost of implementing the upgrade.
        yearly_savings (float): The annual savings resulting from the upgrade.
        break_even_years (float): The number of years required to recoup the investment through savings.
        co2_reduction (float): The estimated reduction in CO2 emissions due to the upgrade.
        kpi_score (float): A score representing the overall effectiveness of the upgrade based on various factors.
    """
    def __init__(self,package_id,from_level,to_level,investment_cost,yearly_savings,break_even_years,co2_reduction,kpi_score):
        """Initializes an UpgradePackage instance with the provided attributes."""
        self.package_id = package_id
        self.from_level = from_level
        self.to_level = to_level
        self.investment_cost = investment_cost
        self.yearly_savings = yearly_savings
        self.break_even_years = break_even_years
        self.co2_reduction = co2_reduction
        self.kpi_score = kpi_score

    def step(self):
        """
        Updates the price per solar panel for the current step.

        The price increases by 
        a random amount defined in the configuration.
        """
        
        # i think i remember we dont want to increase the price so place holder for now.
        # self.investment_cost += round(random.randint(*self.config['upgrade_price_increase']))
        pass

    def is_feasible(self, income, household, environment):
        """
        Determines if the package is feasible for a resident based on their income,
        household characteristics, and environmental factors.

        This method should be implemented by subclasses to define specific
        feasibility criteria for each package type.

        Args:
            income (float): The resident's annual income.
            household (Household): The household considering the package.
            environment (Model): The simulation environment.

        """
        return income > self.investment_cost # Place holder for when new packages get introduced, for now only income is considered for feasibility of upgrades

    def calculate_behavioral_influence(self, income):
        """
        Calculates perceived behavioral control (PBC)
        for a generic housing upgrade.

        Based on:
        - affordability
        - break-even time
        """

        # Affordability influence: The closer the income is to the investment cost, the less influence it has. If the income is much higher than the investment cost, it has a stronger influence. 
        # This is normalized and clipped to ensure it stays within a reasonable range.
        max_diff = self.investment_cost / 3
        min_diff = -(self.investment_cost / 3)

        difference = income - self.investment_cost

        # Normalize the difference to a 0-1 scale, where 0 means the income is much lower than the investment cost (not affordable) and 1 means the income is much higher than the investment cost (very affordable).
        normalized_diff = ((difference - min_diff)/ (max_diff - min_diff))

        # ROI influence
        # Lower break-even = more attractive
        influence_roi = max(0, 0.25 - (0.25 * (self.break_even_years / 30))) # Assuming 30 years as a reference for a long break-even time, this can be adjusted based on the expected lifespan of the upgrade.

        return np.clip(normalized_diff + influence_roi, 0, 1)