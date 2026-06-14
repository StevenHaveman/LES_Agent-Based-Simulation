import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import getLabelIcon from '../utils/getLabelIcon';
import '../styles/MapView.css';

const latitude = 52.091831;
const longitude = 4.388425;
const zoomLevel = 16;
const maxZoomLevel = 22;
const maxNativeZoomLevel = 19;

const radiusWeight = 4;
const selectedCircleTargetPixels = 10;
const minCircleRadiusMeters = 0.5;
const maxCircleRadiusMeters = 25;

const meterPerPixelAtZoom0 = 156543.03392;
const pi = 180;
const twoToThePowerOfZoom = 2;

const getZoomScaledRadiusMeters = (map, lat) => {
    if (!map || typeof lat !== 'number') {
        return minCircleRadiusMeters;
    }

    const zoom = map.getZoom();
    const metersPerPixel = (meterPerPixelAtZoom0 * Math.cos((lat * Math.PI) / pi)) / (twoToThePowerOfZoom ** zoom);
    const radius = selectedCircleTargetPixels * metersPerPixel;

    return Math.max(minCircleRadiusMeters, Math.min(maxCircleRadiusMeters, radius));
};

const MapView = ({ houses, onHouseClick, selectedHouse, clusterMode = false }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const selectedCircleRef = useRef(null);
    const selectedHouseRef = useRef(null);
    const iconSizeNumber = 18;
    const iconAnchorNumber = 9;

    useEffect(() => {
        selectedHouseRef.current = selectedHouse;
    }, [selectedHouse]);

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

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const handleZoomChange = () => {
            const currentHouse = selectedHouseRef.current;
            if (!selectedCircleRef.current || !currentHouse) {
                return;
            }

            selectedCircleRef.current.setRadius(
                getZoomScaledRadiusMeters(mapRef.current, currentHouse.lat)
            );
        };

        mapRef.current.on('zoomend', handleZoomChange);
        return () => {
            if (mapRef.current) {
                mapRef.current.off('zoomend', handleZoomChange);
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

        const getHouseLabel = (house) => {
            if (house.kpi_level !== undefined && house.kpi_level !== null) {
                return house.kpi_level;
            }
            if (Array.isArray(house.residents) && house.residents.length > 0) {
                const r = house.residents.find(res => res && (res.kpi_level !== undefined && res.kpi_level !== null));
                if (r) { return r.kpi_level; }
            }
            return house.energyLabel;
        };

        houses.forEach(house => {
            let marker;
            if (clusterMode) {
                const clusterCounts = {};
                (house.residents || []).forEach(r => {
                    const t = r.cluster_type || 'Unknown';
                    clusterCounts[t] = (clusterCounts[t] || 0) + 1;
                });
                const majority = Object.keys(clusterCounts).sort((a, b) => (clusterCounts[b] || 0) - (clusterCounts[a] || 0))[0];
                const colorMap = {
                    engaged: '#2ac72a',
                    neutral: '#5a5754',
                    resistant: '#ff0000',
                    unknown: '#fffaa4'
                };

                const color = colorMap[majority] || '#888';
                const html = `<div class="cluster-marker-dot" style="--cluster-color:${color}"></div>`;
                const icon = L.divIcon({ html, className: '', iconSize: [iconSizeNumber, iconSizeNumber], iconAnchor: [iconAnchorNumber, iconAnchorNumber] });
                marker = L.marker([house.lat, house.lng], { icon }).addTo(mapRef.current);

                const clusters = Object.entries(clusterCounts).map(([k, v]) => `${k}: ${v}`).join('<br/>') || 'No residents';
                marker.bindTooltip(clusters, { direction: 'top' });
            } else {
                const icon = getLabelIcon(getHouseLabel(house));
                marker = L.marker([house.lat, house.lng], { icon }).addTo(mapRef.current);
                const address = house.address || '';
                const street = address.split(/\s\d/)[0].trim();
                const streetInfo = streetIncomeMap[street];
                if (streetInfo && streetInfo.avgIncome) {
                    marker.bindTooltip(`Street: ${street}<br/>Avg. income: €${streetInfo.avgIncome}`, { direction: 'top' });
                } else {
                    marker.bindTooltip('No residents');
                }
            }

            if (onHouseClick) {
                marker.on('click', () => onHouseClick(house));
            }
            markersRef.current.push(marker);
        });

        if (selectedHouse && selectedHouse.lat && selectedHouse.lng) {
            selectedCircleRef.current = L.circle([selectedHouse.lat, selectedHouse.lng], {
                radius: getZoomScaledRadiusMeters(mapRef.current, selectedHouse.lat),
                color: 'blue',
                weight: radiusWeight,
                fill: true,
                fillColor: 'white',
                fillOpacity: 0.5,
                interactive: false,
                pane: 'markerPane',
            }).addTo(mapRef.current);
        }
    }, [houses, onHouseClick, streetIncomeMap, selectedHouse, clusterMode]);

    return <div id="map" className="map-root" />;
};

MapView.propTypes = {
    houses: PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        energyLabel: PropTypes.string,
        kpi_level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        residents: PropTypes.array,
    })).isRequired,
    onHouseClick: PropTypes.func,
    selectedHouse: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    clusterMode: PropTypes.bool,
};

export default MapView;
