import random
import numpy as np
import utilities

class SustainabilityPackage:
    def __init__(self, name, environment, price_config_key, price_increase_config_key):
        self.name = name
        self.environment = environment
        self.config_id, self.config = utilities.choose_config()
        self.price = self.config[price_config_key]
        self.price_increase_key = price_increase_config_key
        
        self.subj_norm_mod = self.config.get(f"{name.lower().replace(' ', '_')}_subj_norm_mod", 1.0)


    def step(self):
        """Updates the package's price."""
        increase_range = self.config.get(self.price_increase_key, (0,0)) # Default to no increase if key missing
        self.price += round(random.randint(*increase_range))

    def calculate_behavioral_influence(self, income, household):
        """Calculates behavioral influence. To be implemented by subclasses."""
        raise NotImplementedError("Subclasses must implement this method.")

    def calc_roi(self, household):
        """Calculates Return on Investment. To be implemented by subclasses."""
        raise NotImplementedError("Subclasses must implement this method.")

    def update_package_subjective_norm(self, environment):
        """
        Calculates and applies the subjective norm for this specific package
        to all relevant residents in the environment.
        Uses self.name to identify this package.
        """
        subj_norm_level = environment.config['subj_norm_level']
        package_name = self.name

        # --- District Level ---
        if subj_norm_level == "District":
            all_households_in_scope = environment.households
            if not all_households_in_scope:
                subj_norm_value = 0.0
            else:
                num_installed = sum(1 for hh in all_households_in_scope if hh.package_installations.get(package_name, False))
                num_total = len(all_households_in_scope)
                subj_norm_value = (num_installed / (num_total - 1)) if num_total > 0 else 0.0 # total households - 1, since own household doesn't count for calc
            
            subj_norm_value = min(max(0.0, subj_norm_value), 1.0)
            for hh in all_households_in_scope:
                for res in hh.residents:
                    res.package_subjective_norms[package_name] = subj_norm_value
        
        # --- Street Level ---
        elif subj_norm_level == "Street":
            for street_list in environment.streets:
                if not street_list:
                    subj_norm_value_street = 0.0
                else:
                    num_installed_in_street = sum(1 for hh_in_street in street_list if hh_in_street.package_installations.get(package_name, False))
                    num_total_in_street = len(street_list)
                    subj_norm_value_street = (num_installed_in_street / (num_total_in_street - 1)) if num_total_in_street > 0 else 0.0 # total houses in street - 1, because own household doesnt count in calc

                subj_norm_value_street = min(max(0.0, subj_norm_value_street), 1.0)
                for hh_in_street in street_list:
                    for res_in_street in hh_in_street.residents:
                        res_in_street.package_subjective_norms[package_name] = subj_norm_value_street
        
        # --- Direct Level ---
        elif subj_norm_level == "Direct":
            base_norm_for_direct = environment.config.get('subjective_norm', 0.0) # Default base
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
        else: # Default or unknown level, set to configured base
            default_norm = environment.config.get('subjective_norm', 0.0)
            for hh_default in environment.households:
                for res_default in hh_default.residents:
                    res_default.package_subjective_norms[package_name] = default_norm