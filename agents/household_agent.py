from agents.agent import Agent

class Household(Agent):
    def __init__(self, solar_panels: bool):
        super().__init__()
        self.solar_panels = solar_panels

    