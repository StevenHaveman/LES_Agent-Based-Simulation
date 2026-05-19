"""
Utility functions for the agent-based model.

This module provides helper functions, such as generating random values
and loading configurations.
"""
from doctest import Example
import random

from pandas import test
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
        pd.DataFrame: A DataFrame containing the GIS data with relevant columns.
    """

    df = pd.DataFrame(pd.read_excel(gis_data_path))

    # Remove leading/trailing whitespace from column names to ensure they match expected names in the code.
    df.columns = df.columns.str.strip()

    # Standardize energy label formatting (e.g., remove whitespace, convert to uppercase, and unify A+ levels to A).
    df["Energielabel"] = (df["Energielabel"].astype(str).str.replace(r"\s+", "", regex=True).str.upper().replace({"A+": "A", "A++": "A", "A+++": "A"}))

    # Clean the data by dropping rows with missing critical GIS attributes (e.g., 'bouwjaar', 'woning type', 'WoonplaatsNaam').
    df_clean = df.dropna(subset=['Bouwjaar', 'Woning type', 'WoonplaatsNaam', 'Energielabel'])

    return df_clean[["OBJECTID","Oppervlakte","Huisnummer","Postcode","OpenbareRuimteNaam","WoonplaatsNaam","Energielabel","Bouwjaar","Latitude","Longitude", "Woning type"]]

def load_package_data(package_data_path: str):
    """
    Loads package data from a specified file path.
    This function reads an Excel file containing package data, cleans it by removing rows with missing critical attributes, and returns a DataFrame with the relevant columns for the simulation.
    Args:
        package_data_path (str): The file path to the package data.
    Returns:
        pd.DataFrame: A DataFrame containing the cleaned package data with relevant columns.
    """
    df = pd.DataFrame(pd.read_excel(package_data_path))

    # Remove leading/trailing whitespace from column names to ensure they match expected names in the code.
    df.columns = df.columns.str.strip()

    # Clean the data by dropping rows with missing critical package attributes (e.g., 'package_id', 'from_level', 'to_level', 'investment_cost').
    df_clean = df.dropna(subset=["package_step_id", "baseline_level", "kpi_level", "total_price_mid", "savings", "op_co2_B", "break_even_in_years"])
    #Example	baseline_level	 op_cost_B 	op_co2_B	 total_price_mid 	 Savings 	 Break even in years 	kpi_score	kpi_level

    return df_clean[["package_step_id", "baseline_level", "kpi_level", "total_price_mid", "savings", "op_co2_B", "break_even_in_years"]]


def load_survey_data(survey_data_path: str):
    """Loads survey data from a specified file path."""

    df = pd.DataFrame(pd.read_excel(survey_data_path))

    df.columns = df.columns.str.strip()

    return df

def calculate_income_distribution(df):
    """Calculates the income distribution from the survey data."""

    income_column = "Wat is ongeveer uw gezamenlijk maandelijks netto-inkomen?"

    valid_answers = df[
        df[income_column] != "Weet ik niet of zeg ik liever niet"
    ]

    distribution = (valid_answers[income_column].value_counts(normalize=True).to_dict())
    print(test)
    print("Income distribution calculated from survey data:")
    for income_range, proportion in distribution.items():
        print(f"  {income_range}: {proportion:.2%}")

    return distribution


def generate_income(income_distribution): #TODO Add to config to give new income ranges in the future if needed, and to make it more flexible for different contexts.
    """Generates a random income value based on the provided income distribution."""
    groups = list(income_distribution.keys())
    weights = list(income_distribution.values())

    selected_group = random.choices(groups, weights=weights, k=1)[0]

    income_ranges = {
        "0-2.000 euro": (0, 2000),
        "2.000-4.000 euro": (2000, 4000),
        "4.000-6.000 euro": (4000, 6000),
        "6.000 euro of meer": (6000, 8000),
    }

    min_income, max_income = income_ranges[selected_group]

    step = 500
    values = list(range(min_income, max_income + 1, step))

    return random.choice(values)