from agents.agent import Agent


class Resident(Agent):
    def __init__(self, id: int, attitude: float, attitude_mod: float, environ_mod: float, behavioral_mod: float):
        super().__init__()
        self.id = id
        self.attitude = attitude
        self.attitude_mod = attitude_mod
        self.environment_mod = environ_mod
        self.behavioral_mod = behavioral_mod
        self.solar_panels = False

    def calc_decision(self, threshold, influence: tuple, info_dump=False):
        decision_stat = self.attitude * self.attitude_mod + influence[0] * self.environment_mod + influence[1] * self.behavioral_mod
        # print(f"Calculation: {self.attitude} * {self.attitude_mod} + {influence[0]} * {self.environment_mod} + \
        #       {influence[1]} * {self.behavioral_mod} = {decision_stat}")
        if info_dump:
            print(f"Resident {self.id}, decision stat: {decision_stat}")
        if decision_stat > threshold:
            self.solar_panels = True
            return True
        
    def print_values(self,):
        print(f"Attitude: {self.attitude:.2f}, Attitude modifier: {self.attitude_mod:.2f}, Environment modifier: {self.environment_mod:.2f},"
              f"Behavioral modifier: {self.behavioral_mod:.2f}\n")