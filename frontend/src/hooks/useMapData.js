import { useEffect, useState } from 'react';
import overviewService from '../services/OverviewService';

const intervalTime = 3000; // 1000 is 1 second

export const useMapData = () => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await overviewService.fetchHouseholds();
                const mapped = data.map(h => ({
                    lat: h.GIS_attributes?.Latitude,
                    lng: h.GIS_attributes?.Longitude,
                    address: `${h.GIS_attributes?.OpenbareRuimteNaam} ${h.GIS_attributes?.Huisnummer}`,
                    postcode: h.GIS_attributes?.Postcode,
                    energyLabel: h.GIS_attributes?.Energielabel,
                    residents: h.residents || [],
                    houseType: h.GIS_attributes?.['Woning type'],
                    heatPumpInstalled: h['Heat Pump_installed'],
                    solarPanelInstalled: h['Solar Panel_installed'],
                    id: h.id || h.GIS_attributes?.id
                }));
                setHouses(mapped);
            } catch (err) {
                console.error('Failed to load houses', err);
            }
        };
        fetchHouseholds();
        const interval = setInterval(fetchHouseholds, intervalTime);
        return () => clearInterval(interval);
    }, []);

    return houses;
};
