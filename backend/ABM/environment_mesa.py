import random
from mesa import Model
from backend.ABM.agents.household_agent_mesa import Household


class SolarAdoptionModel(Model):
    def __init__(self, nr_households, nr_residents):
        super().__init__()

        self.environmental_inf = 0.0
        self.solarpanel_price = 410  # Gebaseerd op gemiddelde kosten van een zonnepaneel in Nederland
        self.energy_price = 0.32  # https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
        self.decided_residents = 0

        self.households = []  # gewone Python-lijst voor filteren/gemak
        self.residents = []  # gewone Python-lijst voor filteren/gemak
        self.yearly_stats = []

        self.create_agents(nr_households, nr_residents)

    def create_agents(self, nr_households: int, nr_residents: int):
        """
        Creates a specified number of Household agents and distributes residents among them.
        Also initializes the environmental influence and solar panel price.
        """
        base = nr_residents // nr_households
        remainder = nr_residents % nr_households

        for i in range(nr_households):
            hh = Household(self)
            hh.solar_panels = random.random() < 0.15  # 15% kans dat een huis bij voorbaat zonnepanelen heeft, 85% kans van niet
            hh.solarpanel_amount = self.random.choice([6, 8, 10])
            hh.energy_generation = self.random.randint(298, 425)

            self.households.append(hh)
            # self.add_agent(hh)  # voeg toe aan het model (dus aan self.agents)

            nr_res = base + (1 if i < remainder else 0)
            hh.create_residents(nr_res)
            self.residents.append(hh.residents)

        self.update_environmental_influence()

    def step(self):
        """
        Executes a step for each household and resident in the model.
        This includes updating the environmental influence and the solar panel price.
        """
        self.decided_residents = 0

        self._agents_by_type[Household].shuffle_do("step")

        for hh in self._agents_by_type[Household]:
            hh.calc_avg_decision()

        self.update_environmental_influence()

    def update_environmental_influence(self):
        """
        Updates the environmental influence based on the current adoption rate
        of solar panels among households. Also slightly increases solar panel price.

        Args:
            households (list[Household]): The list of households in the simulation.
        """
        nr_solarpanels = 0
        for household in self.households:
            if household.solar_panels == True:
                nr_solarpanels += 1

        self.environmental_inf = min(nr_solarpanels / (len(self.households) - 1), 1)
        self.solarpanel_price += round(random.randint(0, 20))

    def collect_start_of_year_data(self, year):
        all_residents = [resident for household in self.residents for resident in household]
        residents_with_panels = sum(res.solar_decision for res in all_residents)
        households_with_panels = sum(hh.solar_panels for hh in self.households)

        start_state = {
            "residents_for_panels": residents_with_panels,
            "households_with_panels": households_with_panels,
            "environmental_influence": round(self.environmental_inf, 3),
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
            "environmental_influence": round(self.environmental_inf, 3),
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
                f"    Environmental Influence: {self.environmental_inf:.3f}\n"
                f"    Current Solar Panel Price: {self.solarpanel_price}\n")  # Use the price variable directly
