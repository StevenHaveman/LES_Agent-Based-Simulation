import { useEffect, useState } from 'react';
import overviewService from '../services/OverviewService';

export const useMapData = () => {
    const [houses, setHouses] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);

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
                    houseType: h.GIS_attributes?.["Woning type"],
                    heatPumpInstalled: h["Heat Pump_installed"],
                    solarPanelInstalled: h["Solar Panel_installed"],
                    id: h.id || h.GIS_attributes?.id
                }));
                setHouses(mapped);
            } catch (err) {
                console.error('Failed to load houses', err);
            }
        };

        const checkForYearChange = async () => {
            try {
                const graphicsData = await overviewService.getSimulationGraphicResults();
                if (graphicsData && graphicsData.length > 0) {
                    const latestYear = graphicsData[graphicsData.length - 1]?.year;
                    
                    if (latestYear && latestYear !== currentYear) {
                        setCurrentYear(latestYear);
                        await fetchHouseholds();
                    }
                }
            } catch (err) {
                console.error('Failed to check for year change', err);
            }
        };

        fetchHouseholds();
        const interval = setInterval(checkForYearChange, 1000);
        
        return () => clearInterval(interval);
    }, [currentYear]);

    return houses;
};
