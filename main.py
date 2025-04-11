from environment import Environment

def main(nr_years: int = 30, nr_residents: int=1, nr_households: int=1, info_dump=False):
    """
    Initializes and runs the solar panel adoption simulation.

    Args:
        nr_years (int, optional): Number of years to simulate. Defaults to 30.
        nr_residents (int, optional): Total number of residents to create. Defaults to 100.
        nr_households (int, optional): Total number of households to create. Defaults to 50.
        info_dump (bool, optional): Whether to print detailed simulation logs. Defaults to False.
    """
    environment = Environment()
    environment.create_environment(nr_residents, nr_households)
    environment.simulate(nr_years, info_dump)

main(30, 10, 10, info_dump=False)