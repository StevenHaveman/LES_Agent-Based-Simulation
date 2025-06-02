# import pytest
# from agents.resident_agent_mesa import Resident
# from agents.household_agent_mesa import Household
# from environment_mesa import SolarAdoptionModel
#
# def test_resident_initialization():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     assert resident.id == 1
#     assert 0 <= resident.income  # Income should be non-negative
#     assert resident.attitude == 0.2
#     assert resident.attitude_mod == 1.0
#     assert resident.environment_mod == 1.1
#     assert resident.behavioral_mod == 0.9
#     assert not resident.solar_panels
#     print("test_resident_initialization passed!")
#
# def test_resident_behavioral_influence():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     influence = resident.calculate_behavioral_influence(3000)
#     assert -0.3 <= influence <= 0.3  # Influence should be within bounds
#     print("test_resident_behavioral_influence passed!")
#
# def test_resident_calc_decision():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     decision = resident.calc_decision(0.1, (0.1, 3000))
#     assert isinstance(decision, bool) or decision is None  # Should return True or None
#     print("test_resident_calc_decision passed!")
#
# def test_resident_income_update():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     initial_income = resident.income
#     resident.calc_decision(0.1, (0.1, 3000))
#     assert resident.income >= initial_income  # Income should not decrease
#     print("test_resident_income_update passed!")
#
# def test_resident_no_solar_panels_by_default():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     assert not resident.solar_panels  # Should be False initially
#     print("test_resident_no_solar_panels_by_default passed!")
#
# def test_household_initialization():
#     household = Household(False, 1)
#     assert household.id == 1
#     assert not household.solar_panels
#     print("test_household_initialization passed!")
#
# def test_environment_initialization():
#     env = Environment()
#     assert 2600 <= env.solarpanel_price <= 3900  # Price should be within range
#     assert env.environmental_inf == 0.0
#     print("test_environment_initialization passed!")
#
# def test_environment_change_influence():
#     households = [Household(True, i) for i in range(10)]
#     env = Environment()
#     initial_influence = env.environmental_inf
#     env.change_influence(households)
#     assert 0.0 <= env.environmental_inf <= 0.5
#     assert env.environmental_inf >= initial_influence  # Influence should increase
#     print("test_environment_change_influence passed!")
#
# def test_environment_behavioral_influence_increase():
#     env = Environment()
#     initial_behavioral_inf = env.behavioral_inf
#     env.change_influence([Household(True, i) for i in range(5)])
#     assert env.behavioral_inf > initial_behavioral_inf  # Should increase
#     print("test_environment_behavioral_influence_increase passed!")
#
# def test_resident_decision_threshold():
#     resident = Resident(1, 0.2, 1.0, 1.1, 0.9)
#     decision = resident.calc_decision(10, (0.1, 3000))
#     assert decision is None  # Should not install solar panels if threshold is too high
#     print("test_resident_decision_threshold passed!")
#
#
#
# if __name__ == "__main__":
#     pytest.main()