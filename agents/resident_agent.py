from agents.agent import Agent
import numpy as np
import random

class Resident(Agent):
    def __init__(self, id: int, attitude: float, attitude_mod: float, environ_mod: float, behavioral_mod: float):
        super().__init__()
        self.id = id
        self.attitude = attitude
        salary = np.random.normal(3300, 700) # Salaris gebaseerd op mediaan inkomen en standaarddeviatie
        self.income = max(round(salary, -2), 0)

        self.attitude_mod = attitude_mod
        self.environment_mod = environ_mod
        self.behavioral_mod = behavioral_mod
        self.solar_panels = False

    def calculate_behavioral_influence(self, behavioral_inf):
        """Map income vs solar panel price difference to [-0.25, 0.25]"""
        max_diff = 1000  # Bij een salaris van 1000 euro meer of minder dan de prijs van de zonnepanelen, wordt een max influence bereikt
        min_diff = -1000

        difference = self.income - behavioral_inf
        normalized_diff = (difference - min_diff) / (max_diff - min_diff) * 2 - 1
        influence = np.clip(normalized_diff * 0.3, -0.3, 0.3)

        return influence

    def calc_decision(self, threshold, influence: tuple, info_dump=False):
        self.income = int(round(self.income * random.choice([1.00, 1.01, 1.02, 1.03, 1.04, 1.05]), -1))
        behavioral_inf = self.calculate_behavioral_influence(influence[1])
        decision_stat = self.attitude * self.attitude_mod + influence[0] * self.environment_mod + behavioral_inf * self.behavioral_mod
        # print(f"Calculation: {self.attitude} * {self.attitude_mod} + {influence[0]} * {self.environment_mod} + "
        #       f"{behavioral_inf} * {self.behavioral_mod} = {decision_stat}")
        if info_dump:
            print(f"Resident {self.id}, decision stat: {decision_stat}")
        if decision_stat > threshold:
            self.solar_panels = True
            return True
        
    def print_values(self,):
        print(f"Attitude: {self.attitude:.2f}, Attitude modifier: {self.attitude_mod:.2f}, Environment modifier: {self.environment_mod:.2f},"
              f"Behavioral modifier: {self.behavioral_mod:.2f}")