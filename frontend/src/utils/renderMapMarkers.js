import {
    createClusterMarker,
    createEnergyLabelMarker,
} from './mapMarkers';

export const renderMapMarkers = ({
    map,
    houses,
    clusterMode,
    streetIncomeMap,
    onHouseClick,
    markersRef,
}) => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    houses.forEach(house => {
        const marker = clusterMode
            ? createClusterMarker(house, map)
            : createEnergyLabelMarker(
                house,
                map,
                streetIncomeMap
            );

        if (onHouseClick) {
            marker.on('click', () => onHouseClick(house));
        }

        markersRef.current.push(marker);
    });
};
