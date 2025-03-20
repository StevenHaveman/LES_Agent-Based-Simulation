import random

class Environment:
    def __init__(self, environmental_inf: float = 0.0):
        self.environmental_inf = environmental_inf
        self.solarpanel_price = random.randint(2600, 3900) # Gebaseerd op gemiddelde kosten van 6-10 zonnepanelen
        self.behavioral_inf = self.solarpanel_price

    
    def change_influence(self, households: list):
        nr_solarpanels = 0
        for household in households:
            if household.solar_panels:
                nr_solarpanels += 1

        self.environmental_inf = nr_solarpanels / (len(households) * 2)
        self.behavioral_inf += round(random.randint(0, 100))
        return self.environmental_inf, self.behavioral_inf
    
    def print_values(self,):
        print(f"Environmental influence: {self.environmental_inf:.2f}, Behavioral influence: {self.behavioral_inf:.2f}\n\n")
