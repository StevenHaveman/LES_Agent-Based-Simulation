from agents.agent import Agent
from agents.resident_agent import Resident
from agents.household_agent import Household
from environment import Environment

import random

def main(nr_years: int = 30, nr_residents: int=1, nr_households: int=1, info_dump=False):
    environment = Environment()
    environment.create_environment(nr_residents, nr_households)
    environment.simulate(nr_years, info_dump)

main(5, 10, 10, info_dump=False)