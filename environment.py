import random

class Environment:
    def __init__(self, environmental_inf: float, behavioral_inf: float):
        self.environmental_inf = environmental_inf
        self.behavioral_inf = behavioral_inf

    
    def change_influence(self,):
        self.environmental_inf += random.uniform(-0.5, 0.5)
        self.behavioral_inf += random.uniform(-0.5, 0.5)
        return self.environmental_inf, self.behavioral_inf
