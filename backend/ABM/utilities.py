import random
import config

def gen_random_value(range_min: float, range_max: float):
    """
    Generates a random float value within a specified range (inclusive).

    Args:
        range_min (float): The minimum possible value.
        range_max (float): The maximum possible value.

    Returns:
        float: A random float between range_min and range_max.
    """
    return random.uniform(range_min, range_max) 

def choose_config():
    if config.CONFIG_DEFAULT:
        selected_config = config.config_default
    else:
        selected_config = config.config_custom

    return selected_config