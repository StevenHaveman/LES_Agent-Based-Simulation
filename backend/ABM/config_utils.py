import config

def get_frontend_configs():

    frontend_configs = {}

    for key, config_data in config.configs.items():

        frontend_configs[key] = {
            "name": config_data.get("name", f"Config {key}"),

            "settings": {
                k: v
                for k, v in config_data.items()
                if k not in [
                    "cluster_profiles",
                    "gis_data_path",
                    "survey_data_path",
                    "data_save_folder"
                ]
            }
        }

    return frontend_configs