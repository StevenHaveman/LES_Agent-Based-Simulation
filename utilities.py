import random
import yaml

as_enum = lambda name, items: type(name, (), items) if isinstance(items, dict) else type(name, (), {v: i for i, v in enumerate(items)})

with open('settings.yaml', 'r') as file:
    config = yaml.safe_load(file)

settings = as_enum('settings', config)

def gen_random_value(range_min: float, range_max: float):
    return random.uniform(range_min, range_max) 
