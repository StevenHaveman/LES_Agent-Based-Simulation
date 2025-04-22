from environment import Environment

def main(nr_years: int = 30, nr_residents: int=1, nr_households: int=1, info_dump=False):
    environment = Environment()
    environment.create_environment(nr_residents, nr_households)
    environment.simulate(nr_years, info_dump)

main(30, 10, 10, info_dump=False)