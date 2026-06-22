import L from 'leaflet';
import getLabelIcon from './getLabelIcon';

const iconSizeNumber = 18;
const iconAnchorNumber = 9;

export const createClusterMarker = (house, map) => {
    const clusterCounts = {};

    (house.residents || []).forEach(r => {
        const type = r.cluster_type || 'Unknown';

        clusterCounts[type] = (clusterCounts[type] || 0) + 1;
    });

    const majority = Object.keys(clusterCounts)
        .sort((a, b) => clusterCounts[b] - clusterCounts[a])[0];

    const colorMap = {
        engaged: '#00bbff',
        neutral: '#5a5754',
        resistant: '#ffea00',
        unknown: '#fffaa4'
    };

    const color = colorMap[majority] || '#888';

    const html =
        `<div class="cluster-marker-dot"
            style="--cluster-color:${color}">
        </div>`;

    const icon = L.divIcon({
        html,
        className: '',
        iconSize: [iconSizeNumber, iconSizeNumber],
        iconAnchor: [iconAnchorNumber, iconAnchorNumber]
    });

    const marker = L.marker(
        [house.lat, house.lng],
        { icon }
    ).addTo(map);

    const tooltip =
        Object.entries(clusterCounts)
            .map(([k, v]) => `${k}: ${v}`)
            .join('<br/>') || 'No residents';

    marker.bindTooltip(tooltip, {
        direction: 'top'
    });

    return marker;
};

export const createEnergyLabelMarker = (
    house,
    map,
    streetIncomeMap
) => {
    const getHouseLabel = (house) => {
        if (
            house.kpi_level !== undefined &&
            house.kpi_level !== null
        ) {
            return house.kpi_level;
        }

        if (
            Array.isArray(house.residents) &&
            house.residents.length > 0
        ) {
            const resident = house.residents.find(
                r =>
                    r &&
                    r.kpi_level !== undefined &&
                    r.kpi_level !== null
            );

            if (resident) {
                return resident.kpi_level;
            }
        }

        return house.energyLabel;
    };

    const icon = getLabelIcon(
        getHouseLabel(house)
    );

    const marker = L.marker(
        [house.lat, house.lng],
        { icon }
    ).addTo(map);

    const address = house.address || '';
    const street = address.split(/\s\d/)[0].trim();

    const streetInfo =
        streetIncomeMap[street];

    if (
        streetInfo &&
        streetInfo.avgIncome
    ) {
        marker.bindTooltip(
            `Street: ${street}<br/>Avg. income: €${streetInfo.avgIncome}`,
            {
                direction: 'top'
            }
        );
    } else {
        marker.bindTooltip(
            'No residents'
        );
    }

    return marker;
};
