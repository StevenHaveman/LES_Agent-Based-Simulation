CONFIG_DEFAULT = True

config_default = {
    # Main simulation startup parameters
    "nr_households": 840, # https://www.cbs.nl/nl-nl/visualisaties/dashboard-bevolking/woonsituatie/huishoudens-nu#:~:text=Begin%202024%20waren%20er%208,gemiddelde%20huishoudensgrootte%20nog%203%2C49.
    "nr_residents": 1772,
    "simulation_years": 1,

    # Environment parameters
    "environmental_influence": 0.0, # Initial environmental influence (0-1)
    "solar_panel_price": 410, # Initial price of solar panels (in euros), based on Dutch market data
    "energy_price": 0.32, # https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
    "initial_solarpanel_chance": 0.32, # https://www.netbeheernederland.nl/artikelen/nieuws/netbeheerders-zien-aantal-huishoudens-met-zonnepanelen-verder-groeien-2023#:~:text=De%20netbeheerders%20tellen%20inmiddels%20op,in%20ons%20land%20zonnepanelen%20heeft.
    "solarpanel_price_increase": (0, 20), # Random increase in solar panel price per year (in euros)
    "min_nr_houses": 20,
    "max_nr_houses": 60,

    # Household Agent parameters
    "solar_panel_amount_options": [6, 8, 10], # Number of solar panels a household can choose to install
    "energy_generation_range": (298, 425), # Estimated energy generation per panel per year (kWh)
    "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels

    # Resident Agent parameters
    'median_income': 3300,  # Based on Dutch median income (2024)
    'sigma_normal': 700,  # Based on Dutch standard deviation (2024)
    'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
    'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
    'attitude': None,
    'attitude_mod': None,
    'environment_mod': None,
    'behavioral_mod': None
}

config_custom = {
    # Main simulation startup parameters
    "nr_households": 100, # https://www.cbs.nl/nl-nl/visualisaties/dashboard-bevolking/woonsituatie/huishoudens-nu#:~:text=Begin%202024%20waren%20er%208,gemiddelde%20huishoudensgrootte%20nog%203%2C49.
    "nr_residents": 200,
    "simulation_years": 1,

    # Environment parameters
    "environmental_influence": 0.0, # Initial environmental influence (0-1)
    "solar_panel_price": 410, # Initial price of solar panels (in euros), based on Dutch market data
    "energy_price": 0.32, # https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
    "initial_solarpanel_chance": 0.32, # https://www.netbeheernederland.nl/artikelen/nieuws/netbeheerders-zien-aantal-huishoudens-met-zonnepanelen-verder-groeien-2023#:~:text=De%20netbeheerders%20tellen%20inmiddels%20op,in%20ons%20land%20zonnepanelen%20heeft.
    "solarpanel_price_increase": (0, 20), # Random increase in solar panel price per year (in euros)
    "min_nr_houses": 15,
    "max_nr_houses": 70,

    # Household Agent parameters
    "solar_panel_amount_options": [6, 8, 10], # Number of solar panels a household can choose to install
    "energy_generation_range": (298, 425), # Estimated energy generation per panel per year (kWh)
    "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels

    # Resident Agent parameters
    'median_income': 3300,  # Based on Dutch median income (2024)
    'sigma_normal': 700,  # Based on Dutch standard deviation (2024)
    'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
    'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
    'attitude': None,
    'attitude_mod': None,
    'environment_mod': None,
    'behavioral_mod': None
}
