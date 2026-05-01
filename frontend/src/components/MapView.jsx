import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import getLabelIcon from '../utils/getLabelIcon';

const latitude = 52.091831;
const longitude = 4.388425;
const zoomLevel = 16;

const MapView = ({ houses, onHouseClick }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([latitude, longitude], zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap' // Name in the bottom right corner
            }).addTo(mapRef.current);
        }
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update markers when houses change
    useEffect(() => {
        if (!mapRef.current) return;
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        houses.forEach(house => {
            const icon = getLabelIcon(house.energyLabel);
            const marker = L.marker([house.lat, house.lng], { icon }).addTo(mapRef.current);
            if (onHouseClick) {
                marker.on('click', () => onHouseClick(house));
            }
            markersRef.current.push(marker);
        });
    }, [houses, onHouseClick]);

    return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

MapView.propTypes = {
    houses: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        energyLabel: PropTypes.string.isRequired,
    })).isRequired,
    onHouseClick: PropTypes.func,
};

export default MapView;
