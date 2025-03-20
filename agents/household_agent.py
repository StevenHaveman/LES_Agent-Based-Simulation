from agents.agent import Agent

class Household(Agent):
    def __init__(self, solar_panels: bool, id: int):
        super().__init__()
        self.id = id
        self.solar_panels = solar_panels

    def print_values(self,):
        print(f"Household {self.id}, Solar panels installed: {self.solar_panels}")

    