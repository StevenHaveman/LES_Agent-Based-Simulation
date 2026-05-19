import random

CHOSEN_CONFIG = 1

configs = {
    0: {
        # TESTING CONFIG 

        # Main simulation startup parameters
        "seed": random.seed(),
        "nr_households": 840, # https://www.cbs.nl/nl-nl/visualisaties/dashboard-bevolking/woonsituatie/huishoudens-nu#:~:text=Begin%202024%20waren%20er%208,gemiddelde%20huishoudensgrootte%20nog%203%2C49.
        "nr_residents": 1772,
        "simulation_years": 30,
        "gis_data_path": None, # Path to GIS data file
        "survey_data_path": None, # Path to survey data file

        # Environment parameters
        "subjective_norm": 0.0, # Initial environmental influence (0-1)
        "solar_panel_price": 410, # Initial price of solar panels (in euros), based on Dutch market data
        "heat_pump_price": 6000, # https://warmtepompenadvies.nl/warmtepomp-kosten/
        "energy_price": 0.32, # https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
        "gas_price": 1.29, # https://www.gaslicht.com/energienota/gasprijs?utm_source=google&utm_medium=cpc&utm_campaign=1433018089&t_gclid=Cj0KCQjwucDBBhDxARIsANqFdr1-3we-bScEEFLESdSZ_r258D4bGeum-2_xOB-_wuw-533vRRGK4jQaAkNCEALw_wcB&gad_source=1&gad_campaignid=1433018089&gbraid=0AAAAAD_HXpYz9o63iTImp0E2Lu5B8tM3s&gclid=Cj0KCQjwucDBBhDxARIsANqFdr1-3we-bScEEFLESdSZ_r258D4bGeum-2_xOB-_wuw-533vRRGK4jQaAkNCEALw_wcB
        "yearly_energy_usage": (1600, 5000), # https://www.overstappen.nl/energie/gemiddeld-energieverbruik/ 
        "yearly_gas_usage": (900, 1900), # https://www.overstappen.nl/energie/gemiddeld-energieverbruik/ 
        "CO2_electricity": 0.27, # https://www.nn.nl/Inspiratie/CO2-uitstoot.htm
        "CO2_gas": 1.78, # https://www.nn.nl/Inspiratie/CO2-uitstoot.htm 
        "yearly_heatpump_usage": (2000, 2500), # https://www.zonneplan.nl/energie/besparen/hoeveel-stroom-verbruikt-een-warmtepomp
        "initial_solarpanel_chance": 0.32, # https://www.netbeheernederland.nl/artikelen/nieuws/netbeheerders-zien-aantal-huishoudens-met-zonnepanelen-verder-groeien-2023#:~:text=De%20netbeheerders%20tellen%20inmiddels%20op,in%20ons%20land%20zonnepanelen%20heeft.
        "initial_heatpump_chance": 0.07, # https://longreads.cbs.nl/klimaatverandering-en-energietransitie-2023/duurzaam-wonen/#:~:text=Ruim%201%20op%20de%2014%20huishoudens%20heeft%20een%20warmtepomp&text=Het%20gaat%20in%20totaal%20om,Ligthart%20en%20Blijie%2C%202022).
        "solarpanel_price_increase": (0, 20), # Random increase in solar panel price per year (in euros)
        "heatpump_price_increase": (0, 300),
        "solar_panel_norm_influence_strength": 1.0, # Multiplier for how strongly subjective norms influence decisions about solar panels (can be adjusted to test different influence scenarios)
        "heat_pump_norm_influence_strength": 1.0, # Multiplier for how strongly subjective norms influence decisions about heat pumps (can be adjusted to test different influence scenarios)
        "min_nr_houses": 20,
        "max_nr_houses": 60,
        "subj_norm_level": "Street", # District, Street, Direct

        # Household Agent parameters
        "solar_panel_amount_options": [6, 8, 10], # Number of solar panels a household can choose to install
        "energy_generation_range": (298, 425), # Estimated energy generation per panel per year (kWh)
        "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels
        "renovation_cooldown": 10, # Number of years a household needs to wait after installing a package before it can install another one (to prevent unrealistic rapid switching)

        # Resident Agent parameters
        'median_income': 3300,  # Based on Dutch median income (2024)
        'sigma_normal': 700,  # Based on Dutch standard deviation (2024)
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
        'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
        'attitude': None,
        'attitude_sensitivity': None,
        'subj_norm_sensitivity': None,
        'control_sensitivity': None,
        'intention_threshold': 0.0, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
                    0: {
                        "cluster_type": "engaged",
                        "attitude": 0.81,
                        "pbc": 0.73,
                    },
                    1: {
                        "cluster_type": "neutral",
                        "attitude": 0.60,
                        "pbc": 0.48,
                    },
                    2: {
                        "cluster_type": "resistant",
                        "attitude": 0.22,
                        "pbc": 0.18,
                    }
                },

        # Data collection parameters
        'collect_data': True, # Whether to collect data for analysis
        'data_save_folder': 'data/' # Folder to save collected data
    },

    1: {
        # TESTING CONFIG

        # Main simulation startup parameters
        "seed": random.seed(),
        "nr_households": 840, # https://www.cbs.nl/nl-nl/visualisaties/dashboard-bevolking/woonsituatie/huishoudens-nu#:~:text=Begin%202024%20waren%20er%208,gemiddelde%20huishoudensgrootte%20nog%203%2C49.
        "nr_residents": 1772,
        "simulation_years": 30,
        "gis_data_path": None, # Path to GIS data file
        "survey_data_path": None, # Path to survey data file

        # Environment parameters
        "subjective_norm": 0.0, # Initial environmental influence (0-1)
        "solar_panel_price": 410, # Initial price of solar panels (in euros), based on Dutch market data
        "heat_pump_price": 6000, # https://warmtepompenadvies.nl/warmtepomp-kosten/
        "energy_price": 0.32, # https://www.overstappen.nl/energie/stroomprijs/#:~:text=Momenteel%20betreft%20de%20stroomprijs%20gemiddeld,variabel%20energiecontract%20van%2020%20energieleveranciers.
        "gas_price": 1.29, # https://www.gaslicht.com/energienota/gasprijs?utm_source=google&utm_medium=cpc&utm_campaign=1433018089&t_gclid=Cj0KCQjwucDBBhDxARIsANqFdr1-3we-bScEEFLESdSZ_r258D4bGeum-2_xOB-_wuw-533vRRGK4jQaAkNCEALw_wcB&gad_source=1&gad_campaignid=1433018089&gbraid=0AAAAAD_HXpYz9o63iTImp0E2Lu5B8tM3s&gclid=Cj0KCQjwucDBBhDxARIsANqFdr1-3we-bScEEFLESdSZ_r258D4bGeum-2_xOB-_wuw-533vRRGK4jQaAkNCEALw_wcB
        "yearly_energy_usage": (1600, 5000), # https://www.overstappen.nl/energie/gemiddeld-energieverbruik/ 
        "yearly_gas_usage": (900, 1900), # https://www.overstappen.nl/energie/gemiddeld-energieverbruik/ 
        "CO2_electricity": 0.27, # https://www.nn.nl/Inspiratie/CO2-uitstoot.htm
        "CO2_gas": 1.78, # https://www.nn.nl/Inspiratie/CO2-uitstoot.htm 
        "yearly_heatpump_usage": (2000, 2500), # https://www.zonneplan.nl/energie/besparen/hoeveel-stroom-verbruikt-een-warmtepomp
        "initial_solarpanel_chance": 0.32, # https://www.netbeheernederland.nl/artikelen/nieuws/netbeheerders-zien-aantal-huishoudens-met-zonnepanelen-verder-groeien-2023#:~:text=De%20netbeheerders%20tellen%20inmiddels%20op,in%20ons%20land%20zonnepanelen%20heeft.
        "initial_heatpump_chance": 0.07, # https://longreads.cbs.nl/klimaatverandering-en-energietransitie-2023/duurzaam-wonen/#:~:text=Ruim%201%20op%20de%2014%20huishoudens%20heeft%20een%20warmtepomp&text=Het%20gaat%20in%20totaal%20om,Ligthart%20en%20Blijie%2C%202022).
        "solarpanel_price_increase": (0, 20), # Random increase in solar panel price per year (in euros)
        "heatpump_price_increase": (0, 300),
        "solar_panel_norm_influence_strength": 1.0, # Multiplier for how strongly subjective norms influence decisions about solar panels (can be adjusted to test different influence scenarios)
        "heat_pump_norm_influence_strength": 1.0, # Multiplier for how strongly subjective norms influence decisions about heat pumps (can be adjusted to test different influence scenarios)
        "min_nr_houses": 20,
        "max_nr_houses": 60,
        "subj_norm_level": "Street", # District, Street, Direct

        # Household Agent parameters
        "solar_panel_amount_options": [6, 8, 10], # Number of solar panels a household can choose to install
        "energy_generation_range": (298, 425), # Estimated energy generation per panel per year (kWh)
        "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels
        "renovation_cooldown": 10, # Number of years a household needs to wait after installing a package before it can install another one (to prevent unrealistic rapid switching)

        # Resident Agent parameters
        'median_income': 3300,  # Based on Dutch median income (2024)
        'sigma_normal': 700,  # Based on Dutch standard deviation (2024)
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
        'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
        'attitude': None,
        'attitude_sensitivity': None,
        'norm_sensitivity': None,
        'control_sensitivity': None,
        'intention_threshold': 0.0, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
            0: {
                "cluster_type": "engaged",
                "attitude": 0.81,
                "pbc": 0.73,
            },
            1: {
                "cluster_type": "neutral",
                "attitude": 0.60,
                "pbc": 0.48,
            },
            2: {
                "cluster_type": "resistant",
                "attitude": 0.22,
                "pbc": 0.18,
            }
        },
        
        # Weights for RAA components in intention calculation (can be adjusted to test different influence scenarios)
        'weight_attitude': 1.0,
        'weight_norm': 1.0,
        'weight_control': 1.0,

        # Data collection parameters
        'collect_data': True, # Whether to collect data for analysis
        'data_save_folder': 'data/' # Folder to save collected data
    },

    2: {
        # CUSTOM CONFIG 1

        # Main simulation startup parameters
        "nr_households": 100,
        "simulation_years": 1,

        # Environment parameters
        "subjective_norm": 0.0,
        "solar_panel_price": 410,
        "energy_price": 0.32,
        "initial_solarpanel_chance": 0.32,
        "solarpanel_price_increase": (0, 20),
        "min_nr_houses": 15,
        "max_nr_houses": 70,

        # Household Agent parameters
        "solar_panel_amount_options": [6, 8, 10],
        "energy_generation_range": (298, 425),
        "household_decision_threshold": 0.5,
        "renovation_cooldown": 10,
        # Resident Agent parameters
        'median_income': 3300,
        'sigma_normal': 700,
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05],
        'decision_threshold': 0.5,
        'attitude': None,
        'attitude_sensitivity': None,
        'norm_sensitivity': None,
        'control_sensitivity': None,
        'intention_threshold': 0.0, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
            0: {
                "cluster_type": "engaged",
                "attitude": 0.81,
                "pbc": 0.73,
            },
            1: {
                "cluster_type": "neutral",
                "attitude": 0.60,
                "pbc": 0.48,
            },
            2: {
                "cluster_type": "resistant",
                "attitude": 0.22,
                "pbc": 0.18,
            }
        }, 

        # Weights for RAA components in intention calculation (can be adjusted to test different influence scenarios)
        'weight_attitude': 1.0,
        'weight_norm': 1.0,
        'weight_control': 1.0,

        # Data collection parameters
        'collect_data': True, # Whether to collect data for analysis
        'data_save_folder': 'data/' # Folder to save collected data
    }
}