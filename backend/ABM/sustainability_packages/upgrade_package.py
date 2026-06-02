import numpy as np



class UpgradePackage:
    """
    Represents a housing sustainability upgrade.

    Example:
    Bad -> Medium
    Poor -> Good
    """

    def __init__(self,config,package_step_id,baseline_level,target_level,price,yearly_savings,break_even_in_years,co2_output,kpi_score):
        self.config = config
        self.package_step_id = package_step_id
        # Upgrade path
        self.baseline_level = baseline_level
        self.target_level = target_level
        # Name shown in simulation
        self.name = f"{baseline_level}->{target_level}"
        # Financial properties
        self.price = price
        self.yearly_savings = yearly_savings
        self.break_even_in_years = break_even_in_years
        # Sustainability properties
        self.co2_output = co2_output
        self.kpi_score = kpi_score

        # Package-specific subjective norm modifier, defaults to 1.0 if not in config. This allows for certain packages to have a stronger or weaker influence from social norms, which can be calibrated based on real-world data or expert judgment.
        self.norm_influence_strength = self.config.get(f"{self.name.lower().replace(' ', '_')}_norm_influence_strength", 1.0)


    def step(self):
        """
        Placeholder for future package updates.
        """
        pass

    def is_feasible(self, income, household, environment):
        """Determines if the upgrade package is feasible for a given household based on affordability and whether it represents a non-regressive step in terms of KPI level."""

        affordable = income > self.price
        current_rank = household.LEVEL_RANK[household.current_kpi_level]
        target_rank = household.LEVEL_RANK[self.target_level]

        no_backwards_step = target_rank >= current_rank

        return affordable and no_backwards_step

    def calculate_behavioral_influence(self, income, household, action_score):
        """
        Calculates actual control / feasibility score (0-1) for a renovation package.

        Inputs:
        - income: household income
        - affordability: ability to pay for the package
        - ROI: financial attractiveness
        - action_score: survey-based behavioral signal (external driver)

        Output:
        - normalized score between 0 and 1
        """

        affordability = income / self.price if self.price > 0 else 0
        roi = 1 / self.break_even_in_years if self.break_even_in_years else 0

        score = (
            0.4 * affordability +
            0.4 * roi +
            0.2 * action_score
        )

        return max(0, min(score, 1))
    

    def calc_co2_savings(self, household):
        """
        Calculates annual CO2 savings by displacing grid electricity.
        """

        # to be implemented based on the specific upgrade package.
        return self.co2_output
    
    def __str__(self):
        """String representation of the UpgradePackage for easy debugging and visualization."""
        return (
            f"UpgradePackage("
            f"id={self.package_step_id}, "
            f"name={self.name}, "
            f"cost={self.price}, "
            f"break_even={self.break_even_in_years}, "
            f"co2_output={self.co2_output}, "
            f"kpi_score={self.kpi_score}"
            f")"
        )