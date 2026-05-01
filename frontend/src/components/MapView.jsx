import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import getLabelIcon from '../utils/getLabelIcon';

const latitude = 52.086;
const longitude = 4.399;
const zoomLevel = 14;

const MapView = ({ houses, onHouseClick }) => {
    useEffect(() => {
        console.debug('MapView useEffect triggered. houses:', houses, 'onHouseClick:', typeof onHouseClick); //REMOVE
        const map = L.map('map').setView([latitude, longitude], zoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        houses.forEach(house => {
            const icon = getLabelIcon(house.energieLabel);
            const marker = L.marker([house.lat, house.lng], { icon }).addTo(map);
            if (onHouseClick) {
                marker.on('click', () => {
                    console.debug('Marker clicked for house:', house); //REMOVE
                    onHouseClick(house);
                });
            }
        });

        return () => {
            map.remove();
        };
    }, [houses, onHouseClick]);

    return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

MapView.propTypes = {
    houses: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        energieLabel: PropTypes.string.isRequired,
    })).isRequired,
    onHouseClick: PropTypes.func,
};

export default MapView;
