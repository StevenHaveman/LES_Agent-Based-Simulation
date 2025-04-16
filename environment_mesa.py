from mesa import Model
from agents.household_agent_mesa import Household
from agents.resident_agent_mesa import Resident
from utilities import gen_random_value

class SolarAdoptionModel(Model):
    def __init__(self, nr_households: int = 10, nr_residents: int = 10):
        super().__init__()

        self.environmental_inf = 0.0
        self.solarpanel_price = 410
        self.energy_price = 0.32
        self.decided_residents = 0

        self.households = []  # gewone Python-lijst voor filteren/gemak
        self.residents = []  # gewone Python-lijst voor filteren/gemak

        self.create_agents(nr_households, nr_residents)

    def create_agents(self, nr_households: int, nr_residents: int):
        counter = 0
        base = nr_residents // nr_households
        remainder = nr_residents % nr_households

        for i in range(nr_households):
            hh = Household(self)
            hh.solar_panels = False
            hh.solarpanel_amount = self.random.choice([6, 8, 10])
            hh.energy_generation = self.random.randint(298, 425)

            self.households.append(hh)
            # self.add_agent(hh)  # voeg toe aan het model (dus aan self.agents)

            n_res = base + (1 if i < remainder else 0)
            for _ in range(n_res):
                res = Resident(
                    gen_random_value(0, 1),
                    gen_random_value(0, 2),
                    gen_random_value(0, 2),
                    gen_random_value(0, 2),
                    self,
                    hh
                )
                hh.residents.append(res)
                self.residents.append(res)

    def step(self):
        self.decided_residents = 0

        self.agents.shuffle_do("step")

        for hh in self.households:
            print(hh)
            hh.calc_avg_decision()
            if hh.solar_panels:
                print(f"Household {hh.unique_id} got solar panels!")

        self.update_environmental_influence()

    def update_environmental_influence(self):
        with_panels = sum(1 for h in self.households if h.solar_panels)
        total = len(self.households)
        if total > 1:
            self.environmental_inf = min(with_panels / (total - 1), 1)
        else:
            self.environmental_inf = 0
        self.solarpanel_price += self.random.randint(0, 20)
