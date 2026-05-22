import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import getLabelIcon from '../utils/getLabelIcon';

const latitude = 52.091831;
const longitude = 4.388425;
const zoomLevel = 16;
const maxZoomLevel = 22;
const maxNativeZoomLevel = 19;

const radiusMeters = 4;
const radiusWeight = 4;

const MapView = ({ houses, onHouseClick, selectedHouse }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const selectedCircleRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([latitude, longitude], zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',maxZoom: maxZoomLevel, maxNativeZoom: maxNativeZoomLevel // Name in the bottom right corner
            }).addTo(mapRef.current);
        }
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const streetIncomeMap = useMemo(() => {
        const map = {};
        houses.forEach(house => {
            const address = house.address || '';
            const street = address.split(/\s\d/)[0].trim();
            if (!street) {return;}
            if (!map[street]) {map[street] = { residents: [] };}
            if (Array.isArray(house.residents)) {
                map[street].residents.push(...house.residents);
            }
        });
        Object.keys(map).forEach(street => {
            const res = map[street].residents;
            map[street].avgIncome = res.length > 0 ? (res.reduce((sum, r) => sum + (r.income || 0), 0) / res.length).toFixed(0) : null;
        });
        return map;
    }, [houses]);

    useEffect(() => {
        if (!mapRef.current) {return;}
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (selectedCircleRef.current) {
            selectedCircleRef.current.remove();
            selectedCircleRef.current = null;
        }

        houses.forEach(house => {
            const icon = getLabelIcon(house.energyLabel);
            const marker = L.marker([house.lat, house.lng], { icon }).addTo(mapRef.current);
            const address = house.address || '';
            const street = address.split(/\s\d/)[0].trim();
            const streetInfo = streetIncomeMap[street];
            if (streetInfo && streetInfo.avgIncome) {
                marker.bindTooltip(`Street: ${street}<br/>Avg. income: €${streetInfo.avgIncome}`, { direction: 'top' });
            } else {
                marker.bindTooltip('No residents');
            }
            if (onHouseClick) {
                marker.on('click', () => onHouseClick(house));
            }
            markersRef.current.push(marker);
        });

        if (selectedHouse && selectedHouse.lat && selectedHouse.lng) {
            selectedCircleRef.current = L.circle([selectedHouse.lat, selectedHouse.lng], {
                radius: radiusMeters,
                color: 'blue',
                weight: radiusWeight,
                fill: true,
                fillColor: 'white',
                fillOpacity: 0.5,
                interactive: false,
                pane: 'markerPane',
            }).addTo(mapRef.current);
        }
    }, [houses, onHouseClick, streetIncomeMap, selectedHouse]);

    return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

MapView.propTypes = {
    houses: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        energyLabel: PropTypes.string.isRequired,
    })).isRequired,
    onHouseClick: PropTypes.func,
    selectedHouse: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
};

export default MapView;
