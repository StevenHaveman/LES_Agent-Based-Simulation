"""
Utility functions for the agent-based model.

This module provides helper functions, such as generating random values
and loading configurations.
"""
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
    """
    Retrieves the selected configuration set for the simulation.

    Reads `CHOSEN_CONFIG` from the `config` module to determine which
    configuration dictionary to load. Defaults to config 0 if the
    chosen one is not found.

    Returns:
        tuple: A tuple containing:
            - chosen_config_id (int): The ID of the chosen configuration.
            - config_data (dict): The configuration dictionary.
    """
    chosen_config_id = config.CHOSEN_CONFIG
    config_data = config.configs.get(chosen_config_id, config.configs[0]) # Default to config 0 if not found
    return chosen_config_id, config_data