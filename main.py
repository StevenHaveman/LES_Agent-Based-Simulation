from agents.agent import Agent
from agents.resident_agent import Resident
from agents.household_agent import Household
from environment import Environment

import random

def gen_random_value(range_min: float, range_max: float):
    return random.uniform(range_min, range_max) 

def main(iter: int, nr_residents: int=1):
    environment = Environment(gen_random_value(-0.1, 0.2), gen_random_value(-0.1, 0.2))

    residents = []
    for i in range(nr_residents):
        residents.append(Resident(i + 1, gen_random_value(-0.1, 0.2), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2)))
    for i in range(iter):
        print(f"Year: {i}")
        influence = environment.change_influence()
        for resident in residents:
            resident.calc_decision(0.5, influence)
            if resident.solar_panels == True:
                print(f"Resident {resident.id} got solar panels!")

main(10, 10)