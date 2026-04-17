export function flattenSimulationData(simulationData, yKey) {
    return simulationData.flatMap(d => {
        const entries = [];
        const { year, end_state_per_package } = d;

        const extract = (key, stateObj, stateLabel) => {
            let value = null;
            switch (key) {
                case 'solar_panel_price':
                    value = stateObj?.['Solar Panel']?.price;
                    break;
                case 'heat_pump_price':
                    value = stateObj?.['Heat Pump']?.price;
                    break;
                case 'solar_panel_households':
                    value = stateObj?.['Solar Panel']?.households_with_package;
                    break;
                case 'solar_panel_positive_decisions':
                    value = stateObj?.['Solar Panel']?.residents_positive_decision;
                    break;
            }
            if (value !== undefined && value !== null) {
                entries.push({ year, state: stateLabel, value });
            }
        };

        extract(yKey, end_state_per_package, 'End');
        return entries;
    });
}
