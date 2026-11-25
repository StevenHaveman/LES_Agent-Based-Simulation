import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapView.css';
import { buildStreetIncomeMap } from '../utils/streetIncome';
/* eslint-disable */
import {
    createClusterMarker,
    createEnergyLabelMarker,
} from '../utils/mapMarkers';
/* eslint-enable */

import { getZoomScaledRadiusMeters } from '../utils/mapRadius';

import { renderMapMarkers } from '../utils/renderMapMarkers';

const latitude = 52.091831;
const longitude = 4.388425;
const zoomLevel = 16;
const maxZoomLevel = 22;
const maxNativeZoomLevel = 19;
const maxFitZoomLevel = 18; // don't zoom in further than this when fitting a small area

const radiusWeight = 4;

const MapView = ({
    houses,
    onHouseClick,
    selectedHouse,
    clusterMode = false,
}) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const selectedCircleRef = useRef(null);
    const selectedHouseRef = useRef(null);

    useEffect(() => {
        selectedHouseRef.current = selectedHouse;
    }, [selectedHouse]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([latitude, longitude], zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap', // Name in the bottom right corner
                maxZoom: maxZoomLevel,
                maxNativeZoom: maxNativeZoomLevel,
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
                getZoomScaledRadiusMeters(mapRef.current, currentHouse.lat),
            );
        };

        mapRef.current.on('zoomend', handleZoomChange);
        return () => {
            if (mapRef.current) {
                mapRef.current.off('zoomend', handleZoomChange);
            }
        };
    }, []);

    const streetIncomeMap = useMemo(() => buildStreetIncomeMap(houses), [houses]);

    // Zoom to the simulated neighbourhood. Houses don't move during a run, so
    // the map only refits when the set of locations changes (e.g. a new area),
    // not on every data refresh, which would undo the user's own panning.
    const fittedBoundsKeyRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const points = houses.filter(
            h => Number.isFinite(h.lat) && Number.isFinite(h.lng),
        );
        if (points.length === 0) {
            return;
        }

        const lats = points.map(h => h.lat);
        const lngs = points.map(h => h.lng);
        const bounds = [
            [Math.min(...lats), Math.min(...lngs)],
            [Math.max(...lats), Math.max(...lngs)],
        ];
        const key = bounds.flat().map(v => v.toFixed(5)).join(',');

        if (fittedBoundsKeyRef.current !== key) {
            fittedBoundsKeyRef.current = key;
            mapRef.current.fitBounds(bounds, {
                padding: [30, 30],
                maxZoom: maxFitZoomLevel,
            });
        }
    }, [houses]);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        if (selectedCircleRef.current) {
            selectedCircleRef.current.remove();
            selectedCircleRef.current = null;
        }

        renderMapMarkers({
            map: mapRef.current,
            houses,
            clusterMode,
            streetIncomeMap,
            onHouseClick,
            markersRef,
        });

        if (selectedHouse?.lat && selectedHouse?.lng) {
            selectedCircleRef.current = L.circle(
                [selectedHouse.lat, selectedHouse.lng],
                {
                    radius: getZoomScaledRadiusMeters(
                        mapRef.current,
                        selectedHouse.lat,
                    ),
                    color: 'blue',
                    weight: radiusWeight,
                    fill: true,
                    fillColor: 'white',
                    fillOpacity: 0.5,
                    interactive: false,
                    pane: 'markerPane',
                },
            ).addTo(mapRef.current);
        }
    }, [houses, onHouseClick, streetIncomeMap, selectedHouse, clusterMode]);

    return <div id="map" className="map-root" />;
};

MapView.propTypes = {
    houses: PropTypes.arrayOf(
        PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
            energyLabel: PropTypes.string,
            kpi_level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            residents: PropTypes.array,
        }),
    ).isRequired,
    onHouseClick: PropTypes.func,
    selectedHouse: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }),
    clusterMode: PropTypes.bool,
};

export default MapView;
