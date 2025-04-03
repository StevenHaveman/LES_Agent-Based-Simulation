from agents.agent import Agent
import numpy as np
import random


class Resident(Agent):
    def __init__(self, id: int, attitude: float, attitude_mod: float, environ_mod: float, behavioral_mod: float, environment):
        super().__init__()
        self.id = id
        self.environment = environment
        salary = self.calc_salary()
        self.income = max(round(salary, -2), 0)

        self.solarpanel_amount = random.choice([6, 8, 10])
        self.energy_generation = random.randint(298, 425)

        self.attitude = attitude
        self.attitude_mod = attitude_mod
        self.environment_mod = environ_mod
        self.behavioral_mod = behavioral_mod
        self.solar_decision = False

    def calc_salary(self):
        median = 3300 # Gebaseerd op mediaan inkomen Nederland anno 2024
        sigma_normal = 700 # Gebaseerd op standaarddeviatie inkomen Nederland anno 2024
        mu = np.log(median)
        sigma_lognormaal = np.sqrt(np.log(1 + (sigma_normal / median) ** 2))

        return np.random.lognormal(mu, sigma_lognormaal)

    def calculate_behavioral_influence(self, solarpanel_price):
        """Map income vs solar panel price difference to [0, 1]"""
        max_diff = 1000
        min_diff = -1000

        difference = self.income - solarpanel_price
        normalized_diff = (difference - min_diff) / (max_diff - min_diff)
        
        return np.clip(normalized_diff, 0, 1)


    def calc_ROI(self):
        """Het berekenen van de terugverdientijd gebaseerd op de formule uit de volgende bron:
        
        https://pure-energie.nl/kennisbank/zonnepanelen-terugverdienen/#:~:text=Gemiddelde%20terugverdientijd%20zonnepanelen,
        -Hoeveel%20jaren%20doe&text=Na%20deze%20jaren%20heb%20je,winst%20maakt%20met%20jouw%20zonnepanelen.
        """
        savings = self.energy_generation * self.solarpanel_amount * self.environment.energy_price
        return self.environment.solarpanel_price * self.solarpanel_amount / savings

    def calc_decision(self, threshold, info_dump=False):
        behavioral_inf = self.calculate_behavioral_influence(self.environment.solarpanel_price * self.solarpanel_amount)
        decision_stat = self.attitude * self.attitude_mod + self.environment.environmental_inf * self.environment_mod + behavioral_inf * self.behavioral_mod

        if decision_stat > threshold:
            self.solar_decision = True
            return True
        if info_dump:
            print(f"Resident {self.id}, decision stat: {decision_stat}")

        self.income = int(round(self.income * random.choice([1.00, 1.01, 1.02, 1.03, 1.04, 1.05]), -1))
        
    def __str__(self):
        """Provides a string representation of the Resident."""
        return (f"Resident {self.id}: Income={self.income}, Attitude={self.attitude:.2f}, "
                f"Mods(Att={self.attitude_mod:.2f}, Env={self.environment_mod:.2f}, Beh={self.behavioral_mod:.2f}), "
                f"Decided for Solar={self.solar_decision}")