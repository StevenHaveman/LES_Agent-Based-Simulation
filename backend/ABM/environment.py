import random
from mesa import Model
from agents.household_agent import Household
import utilities


class SolarAdoptionModel(Model):
    def __init__(self, nr_households, nr_residents):
        super().__init__()
        self.config_id, self.config = utilities.choose_config()

        self.solarpanel_price = self.config['solar_panel_price']
        self.energy_price = self.config['energy_price']
        self.decided_residents = 0

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

        for i in range(nr_households):
            hh = Household(self)
            hh.solar_panels = random.random() < self.config['initial_solarpanel_chance']

            self.households.append(hh)
            # self.add_agent(hh)  # voeg toe aan het model (dus aan self.agents)

            nr_res = base + (1 if i < remainder else 0)
            hh.create_residents(nr_res)
            self.residents.append(hh.residents)

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
                print(i)
                print(len(self.households))
                chosen_list = random.randint(0, len(self.streets) - 1)
                self.streets[chosen_list].append(self.households[i])

    def update_subjective_norm(self):
        subj_norm_level = self.config['subj_norm_level']

        if subj_norm_level == "District":
            nr_solarpanels = 0
            for i in range(len(self.streets)):
                for house in self.streets[i]:
                    if house.solar_panels:
                        nr_solarpanels += 1
            subj_norm = min(nr_solarpanels / (len(self.households) - 1), 1)

            for street in self.streets:
                for house in street:
                    for resident in house.residents:
                        resident.subj_norm = subj_norm

        if subj_norm_level == "Street":
            for i in range(len(self.streets)):
                nr_solarpanels = 0
                for house in self.streets[i]:
                    if house.solar_panels:
                        nr_solarpanels += 1
                    subj_norm = min(nr_solarpanels / (len(self.streets[i]) - 1), 1)

                for house in self.streets[i]:
                    for resident in house.residents:
                        resident.subj_norm = subj_norm

        if subj_norm_level == "Direct":
            for i in range(len(self.streets)):
                for j in range(len(self.streets[i])):
                    skip = any(res.subj_norm >= 1.0 for res in self.streets[i][j].residents)

                    if skip:
                        continue

                    if j > 0 and self.streets[i][j - 1].solar_panels and not self.streets[i][j].skip_prev:
                        for resident in self.streets[i][j].residents:
                            resident.subj_norm += 0.5
                        self.streets[i][j].skip_prev = True

                    # Check next house
                    if j < len(self.streets[i]) - 1 and self.streets[i][j + 1].solar_panels and not self.streets[i][j].skip_next:
                        for resident in self.streets[i][j].residents:
                            resident.subj_norm += 0.5
                        self.streets[i][j].skip_next = True

    def step(self):
        """
        Executes a step for each household and resident in the model.
        This includes updating the environmental influence and the solar panel price.
        """
        self.decided_residents = 0

        self._agents_by_type[Household].shuffle_do("step")

        for hh in self._agents_by_type[Household]:
            hh.calc_avg_decision()

        self.update_subjective_norm()
        self.solarpanel_price += round(random.randint(*self.config['solarpanel_price_increase']))

    def collect_start_of_year_data(self, year):
        all_residents = [resident for household in self.residents for resident in household]
        residents_with_panels = sum(res.solar_decision for res in all_residents)
        households_with_panels = sum(hh.solar_panels for hh in self.households)

        start_state = {
            "residents_for_panels": residents_with_panels,
            "households_with_panels": households_with_panels,
            "solar_panel_price": self.solarpanel_price
        }

        data = {
            "year": year,
            "decisions_this_year": self.decided_residents,
            "start_state": start_state,
        }

        self.yearly_stats.append(data)
        return data

    def collect_end_of_year_data(self, data):
        all_residents = [resident for household in self.residents for resident in household]
        residents_with_panels = sum(res.solar_decision for res in all_residents)
        households_with_panels = sum(hh.solar_panels for hh in self.households)

        end_state = {
            "residents_for_panels": residents_with_panels,
            "households_with_panels": households_with_panels,
            "solar_panel_price": self.solarpanel_price,
            "decisions_this_year": self.decided_residents
        }

        data["end_state"] = end_state


    def collect_household_information(self):
        """
        Verzamelt informatie over alle huishoudens in het model en retourneert deze in JSON-formaat.

        Returns:
            list: Een lijst van huishoudens met hun details en bewoners.
        """
        households_data = []
        for household in self.households:
            household_data = {
                "id": household.unique_id,
                "name": f"Household {household.unique_id}",
                "address": f"Straat {household.unique_id}, Stad",
                "residents": [{"name": f"Resident {i}", "income": resident.income, "Solar_decision": resident.solar_decision} for i, resident in enumerate(household.residents, start=1)]
            }
            households_data.append(household_data)
        return households_data

    def __str__(self):
        """
   Provides a string representation of the Environment's current state.

   Returns:
       str: A summary string of the environment status.
   """
        total_households = len(self.households)
        total_residents = sum(len(h.residents) for h in self.households)
        residents_with_panels = sum(sum(1 for r in h.residents if r.solar_decision) for h in self.households)
        households_with_panels = sum(
            1 for h in self.households if h.solar_panels or any(r.solar_decision for r in h.residents))
        return (f"    Total Residents who would like Panels: {residents_with_panels} / {total_residents}\n"
                f"    Households: {households_with_panels} / {total_households} with panels\n"
                f"    Current Solar Panel Price: {self.solarpanel_price}\n")  # Use the price variable directly

