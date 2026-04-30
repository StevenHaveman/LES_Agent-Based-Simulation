import random
from mesa import Model
import numpy as np
from agents.household_agent import Household
from agents.resident_agent import Resident
import utilities
from sustainability_packages.solar_panel import SolarPanel
from sustainability_packages.heat_pump import HeatPump
from sustainability_packages.upgrade_package import UpgradePackage
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
    # def __init__(self, nr_households, nr_residents): # Maybe no longer needed when we create households based on GIS data, and survey data for residents.
    def __init__(self):
        """
        Initializes the simulation environment.

        Args:
            nr_households (int): The total number of households to create.
            nr_residents (int): The total number of residents to create and
                                distribute among households.
        """
        super().__init__()
        self.config_id, self.config = utilities.choose_config() # Load the chosen configuration This is not used in the frontend defaults to config 1

        # TODO logic should be in its own function, and be a bit more dynamic.
        self.package_data = utilities.load_package_data("data/15_package_steps.xlsx")
        self.sustainability_packages = []
        for _, row in self.package_data.iterrows():

            package = UpgradePackage(
                config=self.config,
                package_step_id=row["package_step_id"],
                baseline_level=row["baseline_level"],
                target_level=row["kpi_level"],
                price=row["total_price_mid"],
                yearly_savings=row["savings"],
                break_even_in_years=row["break_even_in_years"],
                co2_reduction=row["op_co2_B"],
                kpi_score=0
            )
            self.sustainability_packages.append(package)

        self.decided_residents_this_step_per_package = {
            pkg.name: 0 for pkg in self.sustainability_packages
        }
    
        self.energy_price = self.config['energy_price'] 
        self.households = []  # gewone Python-lijst voor filteren/gemak
        self.residents = []  # gewone Python-lijst voor filteren/gemak
        self.streets = [] # Needed for the GIS MAP Maybe? Or all the households will have actual cordinates.
        self.yearly_stats = []
        self.total_co2 = 0
        self.current_co2 = 0
        self.gis_data = utilities.load_gis_data("data/AmstelHeuvelWijk2_TableToExcel.xlsx")


        # self.create_agents(nr_households, nr_residents)
        self.create_household_agents()
        self.create_resident_agents(nr_residents=1) #TODO This is currently set to create 1 resident per household for testing, will need to update when we have survey data to determine household sizes and resident attributes.
        self.generate_streets() 
        self.update_social_norms()

    def create_household_agents(self): # TODO: This is a new version of the create_agents function that will use GIS data to create households with more realistic attributes and distributions. This will likely involve parsing the GIS data to determine household locations, sizes, and other relevant attributes, and then creating Household agents accordingly.
        
        for i, row in self.gis_data.iterrows():
            hh = Household(i, self, gis_attributes=row.to_dict())

            # init emissions #TODO make a emmision based on kpi level since we went away from solar and heatpump.
            # initial_savings = package.calc_co2_savings(hh)
            # hh.co2_saved_yearly += initial_savings
            # self.current_co2 -= initial_savings

            # flags
            for package in self.sustainability_packages:
                hh.skip_prev_flags[package.name] = False
                hh.skip_next_flags[package.name] = False

            self.households.append(hh)

    def create_resident_agents(self, nr_residents=1): # TODO: This function will create Resident agents for a given Household agent, using attributes from the GIS data to assign realistic characteristics to the residents (e.g., income, attitudes). The number of residents created will be based on the household size determined from the GIS data.

        id_counter = 0

        for hh in self.households:
            for _ in range(nr_residents):
                resident = Resident(id_counter, self, hh)

                for package_name, installed in hh.package_installations.items():
                    if installed:
                        resident.package_decisions[package_name] = True

                hh.residents.append(resident)
                self.residents.append(resident)

                id_counter += 1
    # def create_resdent_agents_survey(self, survey_data): # TODO: This function will create Resident agents for a given Household agent, using attributes from the survey data to assign realistic characteristics to the residents (e.g., income, attitudes). The number of residents created will be based on the household size determined from the GIS data.

    #     pass


    def generate_streets(self,):
        """
        Generate a list of streets, where each street is a list of households.

        The total number of households is distributed among streets. The number of
        streets is not fixed, and household counts per street are randomly assigned
        within configured limits, with occasional larger streets.
        """
        pointer = 0
        remaining = len(self.households)
        print (f"Generating streets with {remaining} households...")
        min_households = min(self.config['min_nr_houses'], remaining)
        max_households = self.config['max_nr_houses']

        print(f"Min households per street: {min_households}, Max households per street: {max_households}")

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

    def update_social_norms(self):
        """
        Updates injunctive, descriptive, and perceived norms
        for all residents in the system.
        """
        n_households = max(len(self.households), 1)
        n_residents = max(len(self.residents), 1)

        for package in self.sustainability_packages:

            # DESCRIPTIVE NORM (behavior) 
            installed_ratio = sum(
                hh.package_installations.get(package.name, False)
                for hh in self.households
            ) / n_households

            # INJUNCTIVE NORM (social approval proxy) # TODO This is currently a very simplified proxy for social approval, based on average attitude. This could be made more complex by considering package-specific attitudes, or by incorporating other social factors.
            avg_attitude = sum(
                r.attitude for r in self.residents
            ) / n_residents # TODO Attitude is currently randomly assigned, will need to update when we have survey data to determine resident attitudes.

            # ASSIGN ONCE
            for res in self.residents:
                res.descriptive_norm[package.name] = installed_ratio # TODO This is currently based on household installations, but could be updated to be based on resident decisions instead if that is more appropriate for the model.
                res.injunctive_norm[package.name] = avg_attitude # TODO this is currently based on average attitude, maybe package specific attitudes with install popularity could be used.
                
                # PERCEIVED NORM # This is currently a simple average of descriptive and injunctive norms, but could be made more complex by weighting them differently or by incorporating other factors.
                res.perceived_norm[package.name] = (
                    0.5 * res.injunctive_norm[package.name]
                    + 0.5 * res.descriptive_norm[package.name]
                )          

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

        print("Updating social norms in environment step...")
        self.update_social_norms()

        for package in self.sustainability_packages:
            package.step()

    def collect_environment_data(self): # update this function to collect all the needed info from all the agents within the simulation.
        environment_data = {
            "energy_price": self.energy_price,
            "nr_agents_with_solar_panel": "nog doen", # TODO: ...
            "nr_agents_with_heat_pump": "nog doen", # TODO: ...
            "average_income": np.mean([resident.income for resident in self.residents]),
            "average_attitude": np.mean([resident.attitude for resident in self.residents]),
            "average_perceived_norm": {
                package.name: np.mean([resident.perceived_norm[package.name] for resident in self.residents])
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

    def export_data(self, file_name, year: int) -> None: # TODO I dont believe this is working as a button in the GUI yet?
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

    def collect_end_of_year_data(self, data_from_start_of_year): # TODO Will need to update when new attributes are added top the agents and households.
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

    def collect_household_information(self): # TODO WIll need to update this function to include new information.
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
                "address": f"{household.gis_attributes['WoonplaatsNaam']} | {household.gis_attributes['OpenbareRuimteNaam']}",
                "name": f"Household  {household.gis_attributes['Huisnummer']}",
                "GIS_attributes": household.gis_attributes, # Include all GIS attributes for reference
                "residents": resident_details,
                "package_installations": {
                    pkg.name: household.package_installations.get(pkg.name, False)
                    for pkg in self.sustainability_packages
                }
            }
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
        percentage = (self.current_co2 / self.total_co2 * 100 if self.total_co2 != 0 else 0)
        output += f"    % of CO2 emission relative to district total: {percentage:.1f}"
        output += f"    % of CO2 emission relative to district total: {(self.current_co2 / self.total_co2 * 100 if self.total_co2 != 0 else 0):.1f}"
        return output
        
        