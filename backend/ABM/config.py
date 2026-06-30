import random

CHOSEN_CONFIG = 1

configs = {
    0: {
        # TESTING CONFIG 

        # Main simulation startup parameters
        "seed": random.seed(),
        "gis_data_path": None, # Path to GIS data file
        "survey_data_path": None, # Path to survey data file

        # Environment parameters
        "subjective_norm": 0.0, # Initial environmental influence (0-1)
        "min_nr_houses": 20,
        "max_nr_houses": 60,
        "subj_norm_level": "Street", # District, Street, Direct

        # Household Agent parameters
        "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels
        "renovation_cooldown": 10, # Number of years a household needs to wait after installing a package before it can install another one (to prevent unrealistic rapid switching)

        # Resident Agent parameters
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
        'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
        'attitude_sensitivity': 1,
        'subj_norm_sensitivity': 1,
        'control_sensitivity': 1,
        'intention_threshold': 0.7, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
                    0: {
                        "cluster_type": "Engaged",
                        "attitude": 0.83,
                        "pbc": 0.76,
                        "action": 0.80,
                    },
                    1: {
                        "cluster_type": "Passive",
                        "attitude": 0.60,
                        "pbc": 0.49,
                        "action": 0.55,
                    },
                    2: {
                        "cluster_type": "Skeptic",
                        "attitude": 0.23,
                        "pbc": 0.14,
                        "action": 0.13,
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
        "gis_data_path": None, # Path to GIS data file
        "survey_data_path": None, # Path to survey data file

        # Environment parameters
        "subjective_norm": 0.0, # Initial environmental influence (0-1)
        "min_nr_houses": 20,
        "max_nr_houses": 60,
        "subj_norm_level": "Street", # District, Street, Direct

        # Household Agent parameters
        "household_decision_threshold": 0.5, # Percentage of residents that need to agree for the household to install solar panels
        "renovation_cooldown": 10, # Number of years a household needs to wait after installing a package before it can install another one (to prevent unrealistic rapid switching)

        # Resident Agent parameters
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05], # Random increase in income per year
        'decision_threshold': 0.5, # Decision threshold for investing in sustainable energy
        'attitude_sensitivity': 1,
        'norm_sensitivity': 1,
        'control_sensitivity': 1,
        'intention_threshold': 0.7, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
                    0: {
                        "cluster_type": "Engaged",
                        "attitude": 0.83,
                        "pbc": 0.76,
                        "action": 0.80,
                    },
                    1: {
                        "cluster_type": "Passive",
                        "attitude": 0.60,
                        "pbc": 0.49,
                        "action": 0.55,
                    },
                    2: {
                        "cluster_type": "Skeptic",
                        "attitude": 0.23,
                        "pbc": 0.14,
                        "action": 0.13,
                    }
                },
        
        # Weights for RAA components in intention calculation (can be adjusted to test different influence scenarios)
        'weight_attitude': 1.0,
        'weight_norm': 1.0,
        'weight_control': 1.0,

        # Data collection parameters
        'collect_data': False, # Whether to collect data for analysis
        'data_save_folder': 'data/' # Folder to save collected data
    },

    2: {
        # CUSTOM CONFIG 1

        # Main simulation startup parameters
        "nr_households": 100,
        "simulation_years": 1,

        # Environment parameters
        "subjective_norm": 0.0,
        "min_nr_houses": 15,
        "max_nr_houses": 70,

        # Household Agent parameters
        "household_decision_threshold": 0.5,
        "renovation_cooldown": 10,

        # Resident Agent parameters
        'raise_income': [1.00, 1.01, 1.02, 1.03, 1.04, 1.05],
        'decision_threshold': 0.5,
        'attitude_sensitivity': 1,
        'norm_sensitivity': 1,
        'control_sensitivity': 1,
        'intention_threshold': 0.7, # Decision threshold for forming intentions to invest in sustainable energy
        'cluster_profiles': {
                    0: {
                        "cluster_type": "Engaged",
                        "attitude": 0.83,
                        "pbc": 0.76,
                        "action": 0.80,
                    },
                    1: {
                        "cluster_type": "Passive",
                        "attitude": 0.60,
                        "pbc": 0.49,
                        "action": 0.55,
                    },
                    2: {
                        "cluster_type": "Skeptic",
                        "attitude": 0.23,
                        "pbc": 0.14,
                        "action": 0.13,
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