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
    def __init__(self, nr_households, nr_residents):
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

        self.create_agents(nr_households, nr_residents)
        self.generate_streets()
        self.update_subjective_norm()

    def create_agents(self, nr_households: int, nr_residents: int):
        """
        Creates a specified number of Household agents and distributes residents among them.
        Also initializes the environmental influence and solar panel price.
        """
        base = nr_residents // nr_households
        remainder = nr_residents % nr_households

        # Initialize the agent ID counter
        id_counter = 0

        for i in range(nr_households):
            hh = Household(i, self)
            for package in self.sustainability_packages:
                chance_key = f"initial_{package.name.lower().replace(' ', '')}_chance"
                initial_chance = self.config.get(chance_key, 0.0) # Default to 0% if not in config
                
                hh.package_installations[package.name] = (random.random() < initial_chance)
                
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
        Generate a list of (street_name, household_count) where the total households sum up to total_households.
        The number of streets is not fixed, and household counts are randomly assigned with occasional large streets.
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
        for hh in self.households:
            for package in self.sustainability_packages:
                hh.skip_prev_flags[package.name] = False
                hh.skip_next_flags[package.name] = False
        
        for package in self.sustainability_packages:
            package.update_package_subjective_norm(self)

    def step(self):
        """
        Executes a step for each household and resident in the model.
        This includes updating the environmental influence and the solar panel price.
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
                "residents": {resident.unique_id: {} for resident in self.residents},
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

        data = {
            "year": year,
            "decisions_this_year_total": total_decisions_this_year,
            "decisions_this_year_per_package": dict(self.decided_residents_this_step_per_package),
            "start_state_per_package": data_per_package,
        }
        self.yearly_stats.append(data)
        return data

    def collect_end_of_year_data(self, data_from_start_of_year):
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
        households_data = []
        for household in self.households:
            resident_details = []
            for i, resident in enumerate(household.residents, start=1):
                res_data = {"name": f"Resident {i}", "income": resident.income}
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
        total_households = len(self.households)
        total_residents = sum(len(h.residents) for h in self.households)
        output = f"Environment State:\n"

        for package in self.sustainability_packages:
            pkg_name = package.name
            residents_decided = sum(1 for hh in self.households for r in hh.residents if r.package_decisions.get(pkg_name, False))
            households_installed = sum(1 for hh in self.households if hh.package_installations.get(pkg_name, False))
            
            output += f"  --- {pkg_name} ---\n"
            output += f"    Residents decided for {pkg_name}: {residents_decided} / {total_residents}\n"
            output += f"    Households with {pkg_name}: {households_installed} / {total_households}\n"
            output += f"    Current {pkg_name} Price: {package.price}\n"
        return output
        
        
