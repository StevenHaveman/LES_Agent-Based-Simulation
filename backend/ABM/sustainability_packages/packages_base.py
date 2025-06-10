import random
import numpy as np
import utilities

class SustainabilityPackage:
    """
    Base class for all sustainability packages (e.g., Solar Panels, Heat Pumps).

    This class provides common attributes and methods that individual package
    types can inherit and extend.

    Attributes:
        name (str): The name of the sustainability package.
        environment (Model): Reference to the simulation model.
        config_id (int): Identifier for the chosen configuration.
        config (dict): The configuration dictionary.
        price (float): Current price of the package.
        price_increase_key (str): Configuration key for the package's price increase range.
        subj_norm_mod (float): Package-specific modifier for subjective norm influence.
    """
    def __init__(self, name, environment, price_config_key, price_increase_config_key):
        """
        Initializes a generic sustainability package.

        Args:
            name (str): The name of the package (e.g., "Solar Panel").
            environment (Model): The simulation model/environment.
            price_config_key (str): The key in the configuration file to find the initial price.
            price_increase_config_key (str): The key for the price increase range.
        """
        self.name = name
        self.environment = environment
        self.config_id, self.config = utilities.choose_config()
        self.price = self.config[price_config_key]
        self.price_increase_key = price_increase_config_key
        
        # Package-specific subjective norm modifier, defaults to 1.0 if not in config.
        self.subj_norm_mod = self.config.get(f"{name.lower().replace(' ', '_')}_subj_norm_mod", 1.0)


    def step(self):
        """
        Updates the package's price based on a configured random increase.
        This method is called once per simulation step (e.g., per year).
        """
        increase_range = self.config.get(self.price_increase_key, (0,0)) # Default to no increase if key missing
        self.price += round(random.randint(*increase_range))

    def calculate_behavioral_influence(self, income, household):
        """
        Calculates the behavioral influence component for decision-making.

        This method should be implemented by subclasses to define how factors
        like affordability and ROI influence a resident's decision for this
        specific package.

        Args:
            income (float): The resident's annual income.
            household (Household): The household considering the package.

        Raises:
            NotImplementedError: If not overridden by a subclass.
        """
        raise NotImplementedError("Subclasses must implement this method.")

    def calc_roi(self, household):
        """
        Calculates the Return on Investment (ROI) or payback period for the package.

        This method should be implemented by subclasses to define how ROI is
        calculated for this specific package.

        Args:
            household (Household): The household for which to calculate ROI.

        Raises:
            NotImplementedError: If not overridden by a subclass.
        """
        raise NotImplementedError("Subclasses must implement this method.")

    def update_package_subjective_norm(self, environment):
        """
        Calculates and applies the subjective norm for this specific package
        to all relevant residents in the environment.

        The calculation method depends on the `subj_norm_level` configured
        (e.g., "District", "Street", "Direct"). Uses `self.name` to identify
        this package's adoption rates.

        Args:
            environment (Model): The simulation environment, providing access to
                                 households, streets, and configuration.
        """
        subj_norm_level = environment.config['subj_norm_level']
        package_name = self.name

        # --- District Level ---
        # Subjective norm is based on the adoption rate in the entire district.
        if subj_norm_level == "District":
            all_households_in_scope = environment.households
            if not all_households_in_scope:
                subj_norm_value = 0.0
            else:
                num_installed = sum(1 for hh in all_households_in_scope if hh.package_installations.get(package_name, False))
                num_total = len(all_households_in_scope)
                subj_norm_value = (num_installed / (num_total - 1)) if num_total > 1 else (num_installed / num_total if num_total == 1 else 0.0)

            subj_norm_value = min(max(0.0, subj_norm_value), 1.0)
            for hh in all_households_in_scope:
                for res in hh.residents:
                    res.package_subjective_norms[package_name] = subj_norm_value
        
        # --- Street Level ---
        # Subjective norm is based on the adoption rate within the household's street.
        elif subj_norm_level == "Street":
            for street_list in environment.streets:
                if not street_list:
                    subj_norm_value_street = 0.0
                else:
                    num_installed_in_street = sum(1 for hh_in_street in street_list if hh_in_street.package_installations.get(package_name, False))
                    num_total_in_street = len(street_list)
                    subj_norm_value_street = (num_installed_in_street / (num_total_in_street - 1)) if num_total_in_street > 1 else (num_installed_in_street / num_total_in_street if num_total_in_street == 1 else 0.0)


                subj_norm_value_street = min(max(0.0, subj_norm_value_street), 1.0)
                for hh_in_street in street_list:
                    for res_in_street in hh_in_street.residents:
                        res_in_street.package_subjective_norms[package_name] = subj_norm_value_street
        
        # --- Direct Level ---
        # Subjective norm is influenced by immediate neighbors (previous and next house in the street).
        elif subj_norm_level == "Direct":
            base_norm_for_direct = environment.config.get('subjective_norm', 0.0) # Default base
            # Initialize/reset to base norm
            for hh_res_init in environment.households:
                for r_init in hh_res_init.residents:
                    r_init.package_subjective_norms[package_name] = base_norm_for_direct
            
            for street_list_direct in environment.streets:
                for j_direct, hh_curr_direct in enumerate(street_list_direct):
                    # Check previous house
                    if j_direct > 0 and street_list_direct[j_direct - 1].package_installations.get(package_name, False):
                        if not hh_curr_direct.skip_prev_flags.get(package_name, False):
                            for res_direct in hh_curr_direct.residents:
                                current_norm = res_direct.package_subjective_norms.get(package_name, 0.0)
                                res_direct.package_subjective_norms[package_name] = min(1.0, current_norm + 0.5)
                            hh_curr_direct.skip_prev_flags[package_name] = True
                    
                    # Check next house
                    if j_direct < len(street_list_direct) - 1 and street_list_direct[j_direct + 1].package_installations.get(package_name, False):
                        if not hh_curr_direct.skip_next_flags.get(package_name, False):
                            for res_direct in hh_curr_direct.residents:
                                current_norm = res_direct.package_subjective_norms.get(package_name, 0.0)
                                res_direct.package_subjective_norms[package_name] = min(1.0, current_norm + 0.5)
                            hh_curr_direct.skip_next_flags[package_name] = True
        else: # Default or unknown level, set to configured base subjective norm.
            default_norm = environment.config.get('subjective_norm', 0.0)
            for hh_default in environment.households:
                for res_default in hh_default.residents:
                    res_default.package_subjective_norms[package_name] = default_norm

    def calc_co2_savings(self, household):
        """
        Calculates the annual CO2 savings generated by this package for a given household.

        Args:
            household (Household): The household that has the package installed.

        Returns:
            float: The estimated annual CO2 savings in kg.
        """
        raise NotImplementedError("Subclasses must implement this method.")