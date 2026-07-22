import random
from mesa import Model
import numpy as np
from collections import defaultdict
from agents.household_agent import Household
from agents.resident_agent import Resident
import utilities
from sustainability_packages.upgrade_package import UpgradePackage
from PolicyInterventions import PolicyInterventions
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

        self.package_data = utilities.load_package_data("data/15_package_steps.xlsx")
        self.policy = PolicyInterventions(self)
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
                co2_output=row["op_co2_B"],
                kpi_score=0
            )
            self.sustainability_packages.append(package)

        self.decided_residents_this_step_per_package = {
            pkg.name: 0 for pkg in self.sustainability_packages
        }
    
        self.households = []  # gewone Python-lijst voor filteren/gemak
        self.gis_data = utilities.load_gis_data("data/AmstelHeuvelWijk2_TableToExcel.xlsx")
        self.residents = []  # gewone Python-lijst voor filteren/gemak
        self.survey_data = utilities.load_survey_data("data/survey_data.xlsx")
        self.survey_cluster_profiles = utilities.load_survey_cluster_profiles("data/survey_cluster_profiles.xlsx")
        self.income_distribution = (utilities.calculate_income_distribution(self.survey_data))
        # Social norm settings
        self.social_norm_radius = self.config.get("social_norm_radius", 500)  # Default to 500 meters if not specified in config
        self.street_groups = {} # Build street groups based on GIS data, this will be used for calculating street-level norms and for the heatmap visualization.
        self.yearly_stats = []
        self.total_co2_baseline = 0
        self.current_co2 = 0
        self.total_co2_emitted_over_time = 0

        # Initialize households, residents, streets, and social norms

        self.create_household_agents()
        self.create_residents_from_survey_profiles(nr_residents=1)
        # self.generate_streets()
        self.build_street_groups()
        self.calculate_total_co2() 
        self.update_social_norms()

    def create_household_agents(self): # TODO: This is a new version of the create_agents function that will use GIS data to create households with more realistic attributes and distributions. This will likely involve parsing the GIS data to determine household locations, sizes, and other relevant attributes, and then creating Household agents accordingly.
        
        for i, row in self.gis_data.iterrows():
            hh = Household(i, self, gis_attributes=row.to_dict())
            # flags
            for package in self.sustainability_packages:
                hh.skip_prev_flags[package.name] = False
                hh.skip_next_flags[package.name] = False

            self.households.append(hh)

    def create_residents_from_survey_profiles(self, nr_residents=1):

        id_counter = 0

        for hh in self.households:

            house_type = hh.gis_attributes["Woning type"]

            # filter dataset op woningtype
            cluster_df = self.survey_cluster_profiles[
                self.survey_cluster_profiles["house_type"] == house_type
            ]

            # fallback als woningtype niet bestaat
            if cluster_df.empty:
                cluster_df = self.survey_cluster_profiles

            for _ in range(nr_residents):

                # 1. kies random cluster uit beschikbare rijen
                row = cluster_df.sample(1).iloc[0]
                cluster_type = row["cluster_type"]

                # 2. pak survey profiel binnen zelfde cluster + house_type
                subset = self.survey_cluster_profiles[
                    (self.survey_cluster_profiles["house_type"] == house_type)
                    & (self.survey_cluster_profiles["cluster_type"] == cluster_type)
                ]

                if subset.empty:
                    subset = self.survey_cluster_profiles[
                        self.survey_cluster_profiles["cluster_type"] == cluster_type
                    ]

                if subset.empty:
                    subset = self.survey_cluster_profiles

                survey_profile = subset.sample(1).iloc[0]

                # 3. create resident
                resident = Resident(id_counter, self, hh, survey_profile)

                resident.attitude = survey_profile["attitude_score"]
                resident.survey_pbc = survey_profile["pbc_score"]
                resident.action_score = survey_profile["action_score"]

                if "income" in survey_profile:
                    resident.income = survey_profile["income"]
                else:
                    resident.income = utilities.generate_income(self.income_distribution)

                # package sync
                for package_name, installed in hh.package_installations.items():
                    if installed:
                        resident.package_decisions[package_name] = True

                hh.residents.append(resident)
                self.residents.append(resident)

                id_counter += 1

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

        radius = self.social_norm_radius  # meters

        for resident in self.residents:

            household = resident.household

            nearby_residents = self.get_residents_within_radius(
                household,
                radius
            )

            other_residents = [
                r for r in nearby_residents
                if r.unique_id != resident.unique_id
            ]

            if not other_residents:
                continue

            avg_attitude = np.mean(
                [r.attitude for r in other_residents]
            )

            avg_pbc = np.mean(
                [r.survey_pbc for r in other_residents]
            )

            resident.perceived_norm = (
                0.5 * avg_attitude +
                0.5 * avg_pbc
            )

    def get_residents_within_radius(self, household, radius):

        nearby_residents = []
        nearby_households = []

        lat1 = household.gis_attributes["Latitude"]
        lon1 = household.gis_attributes["Longitude"]

        for other_household in self.households:

            lat2 = other_household.gis_attributes["Latitude"]
            lon2 = other_household.gis_attributes["Longitude"]

            distance = self.calculate_distance(
                lat1,
                lon1,
                lat2,
                lon2
            )

            if distance <= radius:
                nearby_households.append(other_household)

                nearby_residents.extend(
                    other_household.residents
                )

        return nearby_residents
    
    def calculate_distance(self, lat1, lon1, lat2, lon2):

        R = 6371000  # meter

        lat1 = np.radians(lat1)
        lat2 = np.radians(lat2)

        delta_lat = np.radians(lat2 - lat1)
        delta_lon = np.radians(lon2 - lon1)

        a = (
            np.sin(delta_lat / 2)**2
            +
            np.cos(lat1)
            * np.cos(lat2)
            * np.sin(delta_lon / 2)**2
        )

        c = 2 * np.arctan2(
            np.sqrt(a),
            np.sqrt(1 - a)
        )

        return R * c

    # def update_social_norms_OLD(self):
    #     # This function updates the perceived social norms for each resident based on the current state of their street. For simplicity, 
    #     # we calculate an average attitude and PBC for the residents in the same street and use that to update each resident's perceived norm. 
    #     # This is a simplified approach and can be further refined to consider more complex interactions and influences among residents.
    #     for street_name, households in self.street_groups.items():

    #         # Get all residents in the street
    #         residents_in_street = [
    #             r
    #             for hh in households
    #             for r in hh.residents
    #         ]

    #         if not residents_in_street:
    #             continue

    #         # Calculate average attitude and PBC for the street
    #         for resident in residents_in_street:
    #             other_residents = [r for r in residents_in_street if r.unique_id != resident.unique_id]

    #             if not other_residents:
    #                 continue

    #             avg_attitude = np.mean([r.attitude for r in other_residents])

    #             avg_pbc = np.mean([r.survey_pbc for r in other_residents])

    #             # Update the resident's perceived norm based on the average attitude and PBC of their street.
    #             resident.perceived_norm = (0.5 * avg_attitude + 0.5 * avg_pbc) 

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


        print("Updating social norms in environment step...")
        self.update_social_norms()
        for hh in self.households:
             hh.step()

        # Update current CO2 emissions after all households have made their decisions and packages have been applied. 
        # This assumes that the households' step function updates their current CO2 emissions based on their active package and other factors.
        self.current_co2 = self.current_co2 = sum(hh.current_co2_emissions for hh in self.households)
        self.total_co2_emitted_over_time += self.current_co2
        for package in self.sustainability_packages:
            package.step()

    def collect_environment_data(self):

        environment_data = {
            "average_income": np.mean(
                [r.income for h in self.households for r in h.residents]
            ) if self.residents else 0,

            "average_attitude": np.mean(
                [r.attitude for h in self.households for r in h.residents]
            ) if self.residents else 0,
        }

        # system-level feasibility (no cognitive per package split needed here)
        average_actual_control = {
            package.name: np.mean([
                h.actual_control[package.name]
                for h in self.households
            ]) if self.households else 0
            for package in self.sustainability_packages
        }

        environment_data["average_actual_control"] = average_actual_control

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

        data = {
            "year": year,
            "package_data": self.collect_package_adoption_data(),
            # "tpb_data": self.collect_street_heatmap_data(), # TODO This function is not yet implemented, but will collect data on the TPB components for different clusters of residents, which can be used for analyzing behavior patterns and for informing the conversational agent's interactions with residents.
            "co2_data": self.collect_co2_data(),
            "decisions_this_year_total": sum(self.decided_residents_this_step_per_package.values()),
            "decisions_this_year_per_package": dict(self.decided_residents_this_step_per_package),
            "housing_stock": self.collect_housing_stock_data(),
            "kpi_stock": self.collect_kpi_stock_data(),
            "cluster_behavior_data": self.collect_cluster_behavior_data(),
            "average_total_population_data": self.collect_avg_total_population_data()
        }

        # print(data["cluster_behavior_data"])
        self.yearly_stats.append(data)

        return data
    
    def collect_avg_total_population_data(self):
        """
        Collects average TPB (Theory of Planned Behavior) data across all residents.

        Returns:
            dict: A dictionary containing average attitude, perceived norm, and PBC.
        """
        avg_attitude = np.mean([r.attitude for r in self.residents]) if self.residents else 0
        avg_perceived_norm = np.mean([r.perceived_norm for r in self.residents]) if self.residents else 0
        avg_pbc = np.mean([r.survey_pbc for r in self.residents]) if self.residents else 0

        return {
            "average_attitude": avg_attitude,
            "average_perceived_norm": avg_perceived_norm,
            "average_pbc": avg_pbc
        }

    def collect_street_heatmap_data(self):

        street_data = {}

        for household in self.households:
            street_name = household.gis_attributes.get("OpenbareRuimteNaam", "Unknown")

            if street_name not in street_data:
                street_data[street_name] = {}

                for package in self.sustainability_packages:
                    street_data[street_name][package.name] = {
                        "attitude": [],
                        "perceived_norm": [],
                        "pbc": [],
                        "adoption": 0
                    }

            for resident in household.residents:
                for package in self.sustainability_packages:

                    package_name = package.name

                    # Attitude (individual)
                    street_data[street_name][package_name]["attitude"].append(
                        resident.attitude
                    )

                    # Norm (individual perception)
                    street_data[street_name][package_name]["perceived_norm"].append(
                        resident.perceived_norm[package_name]
                    )

                    # PBC (household-level constraint)
                    street_data[street_name][package_name]["pbc"].append(
                        household.actual_control[package_name]
                    )

                    # Adoption (behavior)
                    if resident.package_decisions.get(package_name, False):
                        street_data[street_name][package_name]["adoption"] += 1

        # --- RESULT ---
        result = {}

        for street, packages in street_data.items():
            result[street] = {}

            for package_name, values in packages.items():

                result[street][package_name] = {
                    "average_attitude": np.mean(values["attitude"]) if values["attitude"] else 0,
                    "average_perceived_norm": np.mean(values["perceived_norm"]) if values["perceived_norm"] else 0,
                    "average_pbc": np.mean(values["pbc"]) if values["pbc"] else 0,
                    "adoption_count": values["adoption"]
                }

        # print(f"Collected street heatmap data for year: {result}")

        return result

    def collect_housing_stock_data(self):
        """
        Collects data on the housing stock, specifically the distribution of energy labels among the households. 
        This can be used to understand the baseline characteristics of the housing stock in the simulation and how it may influence residents' decisions regarding sustainability packages.
        """

        labels = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0,
            "E": 0,
            "F": 0,
            "G": 0
        }

        for hh in self.households:
            label = hh.gis_attributes.get("Energielabel")
            if label in labels:
                labels[label] += 1
        return labels
    
    def collect_cluster_behavior_data(self):
        """
        Collect behavioral statistics per cluster.

        Returns:
        - average attitude / norm / pbc (voor line charts)
        - distributions (voor histogram/bar charts)
        """

        def create_buckets():
            return {
                "0.0-0.2": 0,
                "0.2-0.4": 0,
                "0.4-0.6": 0,
                "0.6-0.8": 0,
                "0.8-1.0": 0
            }

        def add_to_bucket(buckets, value):
            value = max(0, min(1, value))

            if value < 0.2:
                buckets["0.0-0.2"] += 1
            elif value < 0.4:
                buckets["0.2-0.4"] += 1
            elif value < 0.6:
                buckets["0.4-0.6"] += 1
            elif value < 0.8:
                buckets["0.6-0.8"] += 1
            else:
                buckets["0.8-1.0"] += 1

        cluster_data = {}

        for resident in self.residents:

            cluster = resident.cluster_type

            if cluster not in cluster_data:
                cluster_data[cluster] = {
                    "attitudes": [],
                    "perceived_norms": [],
                    "pbc_scores": [],

                    "attitude_distribution": create_buckets(),
                    "perceived_norm_distribution": create_buckets(),
                    "pbc_distribution": create_buckets(),

                    "count": 0
                }

            attitude = resident.attitude
            norm = resident.perceived_norm
            pbc = resident.survey_pbc

            cluster_data[cluster]["attitudes"].append(attitude)
            cluster_data[cluster]["perceived_norms"].append(norm)
            cluster_data[cluster]["pbc_scores"].append(pbc)

            add_to_bucket(
                cluster_data[cluster]["attitude_distribution"],
                attitude
            )

            add_to_bucket(
                cluster_data[cluster]["perceived_norm_distribution"],
                norm
            )

            add_to_bucket(
                cluster_data[cluster]["pbc_distribution"],
                pbc
            )

            cluster_data[cluster]["count"] += 1

        result = {}

        for cluster, values in cluster_data.items():

            result[cluster] = {
                # bestaande line chart data
                "average_attitude":
                    float(np.mean(values["attitudes"]))
                    if values["attitudes"] else 0,

                "average_perceived_norm":
                    float(np.mean(values["perceived_norms"]))
                    if values["perceived_norms"] else 0,

                "average_pbc":
                    float(np.mean(values["pbc_scores"]))
                    if values["pbc_scores"] else 0,

                # nieuwe distributies
                "attitude_distribution":
                    values["attitude_distribution"],

                "perceived_norm_distribution":
                    values["perceived_norm_distribution"],

                "pbc_distribution":
                    values["pbc_distribution"],

                "resident_count":
                    values["count"]
            }
            # print(f"Cluster {cluster} behavior data: {result[cluster]}")

        return result

    def collect_kpi_stock_data(self):
        """
        Collects the distribution of household KPI levels.
        """

        kpi_levels = {
            "Bad": 0,
            "Poor": 0,
            "Medium": 0,
            "OK": 0,
            "Good": 0
        }

        for hh in self.households:
            kpi = hh.current_kpi_level

            if kpi in kpi_levels:
                kpi_levels[kpi] += 1

        return kpi_levels
    
    def collect_co2_data(self):
        """
        Collects data related to CO2 emissions and reductions in the environment, 
        based on the current state of the households and their sustainability package installations. 
        This data can be used for tracking the environmental impact of the agents' decisions over time.
        """
        co2_data = {
            "baseline_emissions": self.total_co2_baseline,
            "yearly_emissions": self.current_co2,
            "cumulative_emissions": self.total_co2_emitted_over_time,
            "co2_reduction": self.total_co2_baseline - self.current_co2,
            "monthly_average": self.current_co2 / 12 # we use years now so we may need to delete this.
        }

        return co2_data

    def collect_package_adoption_data(self):
        """"        
        Collects data on the adoption of sustainability packages across the households
        """
        package_data = {}

        for package in self.sustainability_packages:
            # Count the number of residents who have decided for this package.
            residents_positive_decision = sum(
                1
                for hh in self.households
                for res in hh.residents
                if res.package_decisions.get(
                    package.name,
                    False
                )
            )
            # Count the number of households that have installed this package.
            households_with_package = sum(
                1
                for hh in self.households
                if hh.package_installations.get(
                    package.name,
                    False
                )
            )
            # Store the data for this package, including the current price.
            package_data[package.name] = {
                "residents_positive_decision": residents_positive_decision,
                "households_with_package":households_with_package,
                "price":package.price
            }

        return package_data

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
                res_data = {
                    "name": f"Resident {i}",
                    "income": resident.income,
                    "cluster_type" : resident.cluster_type,
                    "unique_id": resident.unique_id,
                    "kpi_level": household.current_kpi_level,
                    "attitude": getattr(resident, "attitude", None),
                    "action_score": getattr(resident, "action_score", 0),
                    "perceived_norm": getattr(resident, "perceived_norm", None),
                    "norm_sensitivity": getattr(resident, "norm_sensitivity", None),
                    "survey_pbc": getattr(resident, "survey_pbc", None),
                    "control_sensitivity": getattr(resident, "control_sensitivity", None),
                    "intention": getattr(resident, "intention", None),
                    "intention_threshold": getattr(resident, "intention_threshold", None),
                    "wants_to_renovate": bool(getattr(resident, "wants_to_renovate", False)),
                    "actual_control": getattr(household, "actual_control", {}),
                    "renovation_cooldown": getattr(household, "renovation_cooldown", 0),
                }
                for pkg_name in [p.name for p in self.sustainability_packages]:
                    res_data[f"{pkg_name}_decision"] = resident.package_decisions.get(pkg_name, False)
                resident_details.append(res_data)

            hh_data = {
                "id": household.unique_id, # Assuming Household has unique_id from Mesa Agent
                "address": f"{household.gis_attributes['WoonplaatsNaam']} | {household.gis_attributes['OpenbareRuimteNaam']}",
                "name": f"Household  {household.gis_attributes['Huisnummer']}",
                "GIS_attributes": household.gis_attributes, # Include all GIS attributes for reference
                "residents": resident_details,
                "current_kpi_level": household.current_kpi_level,
                "residents_with_positive_intention": household.residents_with_positive_intention,
                "renovation_cooldown": household.renovation_cooldown,
                "package_installations": {
                    pkg.name: household.package_installations.get(pkg.name, False)
                    for pkg in self.sustainability_packages
                }
            }
            households_data.append(hh_data)
        return households_data
    
    def calculate_total_co2(self):
        """Calculates the total baseline CO2 emissions for the district based on the initial attributes of the households. This is used as a reference point for tracking CO2 reductions over time."""
        # This function assumes that each household has an attribute or method to estimate its initial CO2 emissions based on its energy label and other relevant factors. 
        # The total baseline CO2 is the sum of these initial emissions across all households.
        self.total_co2_baseline = sum(hh.original_co2_emissions for hh in self.households)
        # Initialize current CO2 to baseline at the start of the simulation
        self.current_co2 = self.total_co2_baseline

    def collect_kpi_data(self): # TODO This function will need to be updated to collect the relevant data for the KPIs we want to track, which may include things like total CO2 saved, average attitude changes, or other metrics based on the agents' attributes and decisions.
        """Collects key performance indicator (KPI) data from the current state of the environment."""
        ##% of houses ready for heat network: Energy label B or higher​
        # Etc. Tbd​
        # Total CO2 emitted in simulation, total CO2 reduced during simulation.​
        # Total spending on renovation by households

        kpi_data = {
            "co2_emissions_start_simulation": self.total_co2_baseline,
            "current_co2_emissions": self.current_co2,
            "total_co2_reduced": self.total_co2_baseline - self.current_co2,
            "total_co2_emitted_during_simulation": self.total_co2_emitted_over_time,
            "total_spending_on_renovation": round(sum(hh.renovation_costs_spend for hh in self.households), 2),
            "percentage_houses_ready_for_heat_network": round(sum(1 for hh in self.households if hh.gis_attributes.get("Energielabel", "") in ["A", "B"]) / len(self.households) * 100, 3) if self.households else 0,}
            
        return kpi_data

    def build_street_groups(self):
        streets = defaultdict(list)

        for hh in self.households:
            street_name = hh.gis_attributes.get("OpenbareRuimteNaam", "Unknown")
            streets[street_name].append(hh)

        self.street_groups = streets

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
        
        