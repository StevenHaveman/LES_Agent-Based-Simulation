import { useEffect, useState } from 'react';
import overviewService from '../services/OverviewService';

export const useMapData = () => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await overviewService.fetchHouseholds();

                const mapped = data.map(h => ({
                    lat: h.GIS_attributes?.Latitude,
                    lng: h.GIS_attributes?.Longitude,

                    address: `${h.GIS_attributes?.WoonplaatsNaam} ${h.GIS_attributes?.OpenbareRuimteNaam} ${h.GIS_attributes?.Huisnummer}`,

                    energieLabel: h.GIS_attributes?.Energielabel,
                }));

                setHouses(mapped);
            } catch (err) {
                console.error('Failed to load houses', err);
            }
        };

        fetchData();
    }, []);

    return houses;
};
