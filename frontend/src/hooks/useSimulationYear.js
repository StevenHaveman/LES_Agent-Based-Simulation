import { useEffect, useState } from 'react';
import overviewService from '../services/OverviewService';

export const useSimulationYear = () => {
    const [year, setYear] = useState(null);

    useEffect(() => {
        const fetchYear = async () => {
            try {
                const graphicsData = await overviewService.getSimulationGraphicResults();
                if (graphicsData && graphicsData.length > 0) {
                    const latestYear = graphicsData[graphicsData.length - 1]?.year;
                    setYear(latestYear);
                }
            } catch (err) {
                console.error('Failed to fetch simulation year', err);
            }
        };

        fetchYear();
        const interval = setInterval(fetchYear, 1000);
        return () => clearInterval(interval);
    }, []);

    return year;
};
