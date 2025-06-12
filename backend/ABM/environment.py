import random
from mesa import Model
import numpy as np
from agents.household_agent import Household
import utilities
from sustainability_packages.solar_panel import SolarPanel
from sustainability_packages.heat_pump import HeatPump
import json
import os

class Environment(Model):
    """
    The main model class for the simulation environment.

    It initializes and manages households, residents, sustainability packages,
    and the overall simulation flow. It also collects data at each step.

    Attributes:
        config_id (int): Identifier for the chosen configuration.
        config (dict): The configuration dictionary.
        solar_panel (SolarPanel): Instance of the SolarPanel package.
        heat_pump (HeatPump): Instance of the HeatPump package.
        sustainability_packages (list): List of all available sustainability packages.
        decided_residents_this_step_per_package (dict): Tracks the number of residents
            who made a positive decision for each package in the current step.
        energy_price (float): Current price of energy (e.g., electricity).
        households (list[Household]): List of all household agents in the model.
        residents (list[list[Resident]]): List of lists, where each inner list contains
            residents of a particular household.
        streets (list[list[Household]]): Households grouped into streets.
        yearly_stats (list[dict]): List to store aggregated data collected each year.
    """
    def __init__(self, nr_households, nr_residents):
        """
        Initializes the simulation environment.

        Args:
            nr_households (int): The total number of households to create.
            nr_residents (int): The total number of residents to create and
                                distribute among households.
        """
        super().__init__()
        self.config_id, self.config = utilities.choose_config()

        self.solar_panel = SolarPanel(self)
        self.heat_pump = HeatPump(self)
        self.sustainability_packages = [self.solar_panel, self.heat_pump]

        self.decided_residents_this_step_per_package = {
                    pkg.name: 0 for pkg in self.sustainability_packages
                }
        
        self.energy_price = self.config['energy_price'] 
        self.households = []  # gewone Python-lijst voor filteren/gemak
        self.residents = []  # gewone Python-lijst voor filteren/gemak
        self.streets = []
        self.yearly_stats = []
        self.total_co2 = 0
        self.current_co2 = 0

        self.create_agents(nr_households, nr_residents)
        self.generate_streets()
        self.update_subjective_norm()

    def create_agents(self, nr_households: int, nr_residents: int):
        """
        Creates a specified number of Household agents and distributes residents among them.

        Initializes households with a chance to have pre-installed sustainability packages
        based on configuration. Residents are then created within these households.

        Args:
            nr_households (int): The number of household agents to create.
            nr_residents (int): The total number of resident agents to create and
                                distribute among the households.
        """
        base = nr_residents // nr_households
        remainder = nr_residents % nr_households

        # Initialize the agent ID counter
        id_counter = 0

        for i in range(nr_households):
        
            hh = Household(i, self)
            hh_emissions = hh.calc_co2_emissions()
            self.total_co2 += hh_emissions
            self.current_co2 += hh_emissions
            for package in self.sustainability_packages:
                chance_key = f"initial_{package.name.lower().replace(' ', '')}_chance"
                initial_chance = self.config.get(chance_key, 0.0) # Default to 0% if not in config
                
                hh.package_installations[package.name] = (random.random() < initial_chance)

                if hh.package_installations.get(package.name, False):
                    initial_savings = package.calc_co2_savings(hh)
                    hh.co2_saved_yearly += initial_savings
                    self.current_co2 -= initial_savings
                
                hh.skip_prev_flags[package.name] = False
                hh.skip_next_flags[package.name] = False

            self.households.append(hh)

            nr_res_for_hh = base + (1 if i < remainder else 0)
            id_counter = hh.create_residents(nr_res_for_hh, id_counter)
            self.residents.extend(hh.residents)
        
        for hh_obj in self.households:
            for res_obj in hh_obj.residents:
                for package in self.sustainability_packages:
                    if package.name not in res_obj.package_subjective_norms:
                         res_obj.package_subjective_norms[package.name] = self.config.get('subjective_norm', 0.0)

    def generate_streets(self,):
        """
        Generate a list of streets, where each street is a list of households.

        The total number of households is distributed among streets. The number of
        streets is not fixed, and household counts per street are randomly assigned
        within configured limits, with occasional larger streets.
        """
        pointer = 0
        remaining = self.config['nr_households']
        min_households = min(self.config['min_nr_houses'], self.config['nr_households'])
        max_households = self.config['max_nr_houses']

        while remaining >= min_households:
            # 20% chance to pick a large household count (closer to max)
            if random.random() < 0.2:
                value = random.randint(int(max_households * 0.7), max_households)
            else:
                value = random.randint(min_households, int(max_households * 0.6))

            value = min(value, remaining)
            self.streets.append(self.households[pointer: pointer + value])
            pointer += value
            remaining -= value

        if remaining > 0:
            for i in range(pointer, len(self.households)):
                chosen_list = random.randint(0, len(self.streets) - 1)
                self.streets[chosen_list].append(self.households[i])

    def update_subjective_norm(self):
        """
        Updates the subjective norm for all residents regarding each sustainability package.

        This involves resetting flags for "Direct" norm calculation (if applicable)
        and then invoking the package-specific subjective norm update logic.
        """
        for hh in self.households:
            for package in self.sustainability_packages:
                hh.skip_prev_flags[package.name] = False
                hh.skip_next_flags[package.name] = False
        
        for package in self.sustainability_packages:
            package.update_package_subjective_norm(self)

    def step(self):
        """
        Executes one step (typically representing a year) of the simulation.

        This involves:
        1. Resetting the count of residents who decided for packages in this step.
        2. Executing the step method for each household.
        3. Updating the subjective norm across the environment.
        4. Executing the step method for each sustainability package (e.g., price updates).
        """
        for pkg_name in self.decided_residents_this_step_per_package:
            self.decided_residents_this_step_per_package[pkg_name] = 0

        for hh in self.households:
             hh.step()

        self.update_subjective_norm()

        for package in self.sustainability_packages:
            package.step()

    def collect_environment_data(self):
        environment_data = {
            "energy_price": self.energy_price,
            "nr_agents_with_solar_panel": "nog doen", # TODO: ...
            "nr_agents_with_heat_pump": "nog doen", # TODO: ...
            "average_income": np.mean([resident.income for resident in self.residents]),
            "average_attitude": np.mean([resident.attitude for resident in self.residents]),
            "average_subjective_norm": {
                package.name: np.mean([resident.subj_norm[package.name] for resident in self.residents])
                for package in self.sustainability_packages
            },
            "average_behavioral_control": {
                package.name: np.mean([resident.behavioral_control[package.name] for resident in self.residents])
                for package in self.sustainability_packages
            }
        }

        return environment_data
    
    def setup_data_structure(self, file_name) -> None:       
        data = {
            "metadata":{
                "config_id": self.config_id,
                "nr_households": self.config['nr_households'],
                "nr_residents": self.config['nr_residents'],
                "simulation_years": self.config['simulation_years'],
                "subjective_norm": self.config['subjective_norm'],
            },
            "simulation_years": {
                f"year {year}": {
                    "residents_data": {},
                    "environment_data": {}
                } for year in range(1, self.config['simulation_years'] + 1)
            },
            "conversation_history": {
                "residents": {resident.unique_id: [] for resident in self.residents},
            }
        }

        # Dump to the json file
        with open(file_name, 'w+') as file:
            json.dump(data, file, indent=4)

    def export_data(self, file_name, year: int) -> None:
        if not os.path.exists(file_name):
            raise FileNotFoundError(f"Data file {file_name} not found.")

        # Load current JSON data
        with open(file_name, 'r') as file:
            data = json.load(file)

        year_key = f"year {year}"

        for resident in self.residents:
            resident_data = resident.collect_resident_data()
            data['simulation_years'][year_key]['residents_data'][resident.unique_id] = resident_data

        environment_data = self.collect_environment_data()
        data['simulation_years'][year_key]['environment_data'] = environment_data

        # Save to file
        with open(file_name, 'w') as file:
            json.dump(data, file, indent=4)
        

    def collect_start_of_year_data(self, year):
        """
        Collects and stores data at the beginning of a simulation year.

        This includes counts of residents with positive decisions, households with
        installed packages, and package prices, for each sustainability package.
        Also records total decisions made in the *previous* year (which is now "this step").

        Args:
            year (int): The current simulation year.

        Returns:
            dict: A dictionary containing the collected data for the start of the year.
        """
        data_per_package = {}
        for package in self.sustainability_packages:
            residents_positive_decision = sum(
                1 for hh in self.households for res in hh.residents if res.package_decisions.get(package.name, False)
            )
            households_with_package = sum(
                1 for hh in self.households if hh.package_installations.get(package.name, False)
            )
            data_per_package[package.name] = {
                "residents_positive_decision": residents_positive_decision,
                "households_with_package": households_with_package,
                "price": package.price
            }
        
        total_decisions_this_year = sum(self.decided_residents_this_step_per_package.values())
        total_yearly_co2_saved = sum(hh.co2_saved_yearly for hh in self.households)

        data = {
            "year": year,
            "decisions_this_year_total": total_decisions_this_year, # This is actually decisions from end of previous year / during this step
            "decisions_this_year_per_package": dict(self.decided_residents_this_step_per_package),
            "start_state_per_package": data_per_package,
            "total_co2_saved_yearly": total_yearly_co2_saved,
        }

        self.yearly_stats.append(data)
        return data

    def collect_end_of_year_data(self, data_from_start_of_year):
        """
        Collects and appends data at the end of a simulation year to the
        data collected at the start of the year.

        This includes updated counts of residents with positive decisions,
        households with installed packages, package prices, and the number
        of decisions made during the current year's step.

        Args:
            data_from_start_of_year (dict): The data dictionary collected at the
                                            start of the current year.
        """
        end_data_per_package = {}
        for package in self.sustainability_packages:
            residents_positive_decision = sum(
                1 for hh in self.households for res in hh.residents if res.package_decisions.get(package.name, False)
            )
            households_with_package = sum(
                1 for hh in self.households if hh.package_installations.get(package.name, False)
            )
            end_data_per_package[package.name] = {
                "residents_positive_decision": residents_positive_decision,
                "households_with_package": households_with_package,
                "price": package.price
            }
        
        total_decisions_this_year_end = sum(self.decided_residents_this_step_per_package.values())

        data_from_start_of_year["end_state_per_package"] = end_data_per_package
        data_from_start_of_year["decisions_this_year_total_end"] = total_decisions_this_year_end 
        data_from_start_of_year["decisions_this_year_per_package_end"] = dict(self.decided_residents_this_step_per_package)

    def collect_household_information(self):
        """
        Collects detailed information about each household and its residents.

        This data is typically used for providing a detailed view of the
        simulation state at the end, often for UI display.

        Returns:
            list[dict]: A list of dictionaries, where each dictionary contains
                        detailed information for a household, including its residents'
                        attributes and decisions.
        """
        households_data = []
        for household in self.households:
            resident_details = []
            for i, resident in enumerate(household.residents, start=1):
                res_data = {"name": f"Resident {i}", "income": resident.income, 'unique_id': resident.unique_id}
                for pkg_name in [p.name for p in self.sustainability_packages]:
                    res_data[f"{pkg_name}_decision"] = resident.package_decisions.get(pkg_name, False)
                resident_details.append(res_data)

            hh_data = {
                "id": household.unique_id, # Assuming Household has unique_id from Mesa Agent
                "name": f"Household {household.unique_id}", # Or however you identify them
                "residents": resident_details
            }
            for pkg_name in [p.name for p in self.sustainability_packages]:
                 hh_data[f"{pkg_name}_installed"] = household.package_installations.get(pkg_name, False)
            households_data.append(hh_data)
        return households_data

    def __str__(self):
        """
        Returns a string representation of the current state of the environment.

        Includes total number of households and residents, and for each
        sustainability package: the number of residents who decided for it,
        the number of households that installed it, and its current price.

        Returns:
            str: A summary string of the environment's state.
        """
        total_households = len(self.households)
        total_residents = sum(len(h.residents) for h in self.households)
        output = f"Environment State:\n"

        for package in self.sustainability_packages:
            pkg_name = package.name
            residents_decided = sum(1 for hh in self.households for r in hh.residents if r.package_decisions.get(pkg_name, False))
            households_installed = sum(1 for hh in self.households if hh.package_installations.get(pkg_name, False))
            total_yearly_co2_saved = sum(hh.co2_saved_yearly for hh in self.households)
            
            output += f"  --- {pkg_name} ---\n"
            output += f"    Residents decided for {pkg_name}: {residents_decided} / {total_residents}\n"
            output += f"    Households with {pkg_name}: {households_installed} / {total_households}\n"
            output += f"    Current {pkg_name} Price: {package.price}\n"
        output += f"  --- MISC INFO ---\n"
        output += f"    Total CO2 saved so far: {total_yearly_co2_saved / 1000:.1f} tons\n"
        output += f"    % of CO2 emission relative to district total: {self.current_co2 / self.total_co2 * 100:.1f}"
        return output
        
        