import numpy as np


class UpgradePackage:
    """
    Represents a housing sustainability upgrade.

    Example:
    Bad -> Medium
    Poor -> Good
    """

    def __init__(self,package_step_id,baseline_level,target_level,investment_cost,yearly_savings,break_even_in_years,co2_reduction,kpi_score):
        self.package_step_id = package_step_id
        # Upgrade path
        self.baseline_level = baseline_level
        self.target_level = target_level
        # Name shown in simulation
        self.name = f"{baseline_level}->{target_level}"
        # Financial properties
        self.investment_cost = investment_cost
        self.yearly_savings = yearly_savings
        self.break_even_in_years = break_even_in_years
        # Sustainability properties
        self.co2_reduction = co2_reduction
        self.kpi_score = kpi_score


    def step(self):
        """
        Placeholder for future package updates.
        """
        pass

    def is_feasible(self, income, household, environment):
        """
        Checks whether this upgrade is possible.

        Conditions:
        - household must currently be at baseline level
        - resident must roughly afford it
        """

        correct_level = (household.current_kpi_level == self.baseline_level)
        affordable = income > self.investment_cost

        return correct_level and affordable

    def calculate_behavioral_influence(self, income):
        """
        Calculates perceived behavioral control (PBC).

        Based on:
        - affordability
        - break-even attractiveness
        """

        # --- AFFORDABILITY ---
        max_diff = self.investment_cost / 3
        min_diff = -(self.investment_cost / 3)

        difference = income - self.investment_cost

        normalized_diff = ((difference - min_diff) / (max_diff - min_diff))

        # --- BREAK EVEN INFLUENCE ---
        if self.break_even_in_years is None:
            influence_roi = 0
        else:
            influence_roi = max(0, 0.25 - (0.25 *(self.break_even_in_years / 30))) # Assuming 30 years is the max break-even time considered attractive, with a linear decrease in attractiveness.

        # --- FINAL PBC ---
        return np.clip(normalized_diff + influence_roi, 0, 1)
    
    def __str__(self):
        """String representation of the UpgradePackage for easy debugging and visualization."""
        return (
            f"UpgradePackage("
            f"id={self.package_step_id}, "
            f"name={self.name}, "
            f"cost={self.investment_cost}, "
            f"break_even={self.break_even_in_years}, "
            f"co2_reduction={self.co2_reduction}, "
            f"kpi_score={self.kpi_score}"
            f")"
        )