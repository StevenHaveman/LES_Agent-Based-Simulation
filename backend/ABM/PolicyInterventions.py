import random


class PolicyInterventions:

    def __init__(self, environment):
        self.environment = environment

    def _clamp(self, value):
        """Ensure values stay between 0 and 1."""
        return max(0.0, min(1.0, value))

    def _get_attitude_effect(self, cluster):
        if cluster == "engaged":
            return random.uniform(0.0, 0.1)

        elif cluster == "neutral":
            return random.uniform(0.0, 0.2)

        elif cluster == "resistant":
            return random.uniform(-0.1, 0.1)

        return 0.0

    def _get_pbc_effect(self, cluster):
        if cluster == "engaged":
            return random.uniform(0.0, 0.1)

        elif cluster == "neutral":
            return random.uniform(0.0, 0.2)

        elif cluster == "resistant":
            return random.uniform(-0.1, 0.1)

        return 0.0

    def sustainability_information_campaign(self):
        """
        Affects attitude only.
        """

        for household in self.environment.households:

            for resident in household.residents:

                effect = self._get_attitude_effect(
                    resident.cluster_type
                )

                resident.attitude = self._clamp(
                    resident.attitude + effect
                )

    def renovation_information_campaign(self):
        """
        Affects perceived behavioural control only.
        """

        for household in self.environment.households:

            for resident in household.residents:

                effect = self._get_pbc_effect(
                    resident.cluster_type
                )

                resident.survey_pbc = self._clamp(
                    resident.survey_pbc + effect
                )

    def financial_subsidy(self, amount):
        """
        Subsidy has:
        1. Rational effect (stored on household)
        2. Psychological effect on PBC
        """

        for household in self.environment.households:

            # Rational effect
            household.active_subsidy = amount

            for resident in household.residents:

                effect = self._get_pbc_effect(
                    resident.cluster_type
                )

                resident.survey_pbc = self._clamp(
                    resident.survey_pbc + effect
                )

    def announce_heat_grid(self):
        """
        Affects both attitude and PBC.
        """

        for household in self.environment.households:

            household.heat_grid_announced = True

            for resident in household.residents:

                attitude_effect = self._get_attitude_effect(
                    resident.cluster_type
                )

                pbc_effect = self._get_pbc_effect(
                    resident.cluster_type
                )

                resident.attitude = self._clamp(
                    resident.attitude + attitude_effect
                )

                resident.survey_pbc = self._clamp(
                    resident.survey_pbc + pbc_effect
                )