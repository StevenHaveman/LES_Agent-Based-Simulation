from environment import Environment
from utilities import settings


environment = Environment()
environment.create_environment(settings.NUM_AGENTS, settings.NUM_HOUSEHOLDS)
environment.simulate(settings.SIM_DURATION, False)