"""
Utility functions for the agent-based model.

This module provides helper functions, such as generating random values
and loading configurations.
"""
import random
import config
import pandas as pd

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

def load_gis_data(gis_data_path: str):
    """
    Loads GIS data from a specified file path.

    This function is a placeholder for the actual implementation of GIS data loading.
    In a real implementation, this would read from a file (e.g., CSV, JSON) and
    parse the GIS data into a usable format for the simulation.

    Args:
        gis_data_path (str): The file path to the GIS data.
    Returns:
    """

    df = pd.DataFrame(pd.read_excel(gis_data_path))

    # Remove leading/trailing whitespace from column names to ensure they match expected names in the code.
    df.columns = df.columns.str.strip()

    # Clean the data by dropping rows with missing critical GIS attributes (e.g., 'bouwjaar', 'woning type', 'WoonplaatsNaam').
    df_clean = df.dropna(subset=['Bouwjaar', 'Woning type', 'WoonplaatsNaam'])
    # print(df.columns) ## Test print to check column names and formatting, adjust as needed for the actual data file.

    # print(df[["OBJECTID","Oppervlakte","Huisnummer","Postcode","OpenbareRuimteNaam","WoonplaatsNaam","Energielabel","Bouwjaar","Latitude","Longitude", "Woning type"]].head())

    return df_clean[["OBJECTID","Oppervlakte","Huisnummer","Postcode","OpenbareRuimteNaam","WoonplaatsNaam","Energielabel","Bouwjaar","Latitude","Longitude", "Woning type"]].tail(100)
