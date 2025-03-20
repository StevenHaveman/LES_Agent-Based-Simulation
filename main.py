from agents.agent import Agent
from agents.resident_agent import Resident
from agents.household_agent import Household
from environment import Environment

import random

def gen_random_value(range_min: float, range_max: float):
    return random.uniform(range_min, range_max) 

def main(iter: int, nr_residents: int=1, info_dump=False):
    environment = Environment(gen_random_value(-0.1, 0.2), gen_random_value(-0.1, 0.2))
    if info_dump:
        print("Environment created with starting values:")
        environment.print_values()

    residents = []
    for i in range(nr_residents):
        residents.append(Resident(i + 1, gen_random_value(-0.1, 0.2), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2), gen_random_value(0.9, 1.2)))
        if info_dump:
            print(f"Resident created with starting values:")
            residents[i].print_values()
    for i in range(iter):
        print(f"Year: {i}")
        influence = environment.change_influence()
        for resident in residents:
            resident.calc_decision(0.5, influence, info_dump)
        for resident in residents:
            if resident.solar_panels == True:
                print(f"Resident {resident.id} got solar panels!")

main(10, 5, info_dump=True)