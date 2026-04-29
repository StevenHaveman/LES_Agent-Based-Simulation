import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ houses }) => {
    useEffect(() => {
        const map = L.map('map').setView([52.086, 4.399], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        houses.forEach(house => {
            L.marker([house.lat, house.lng]).addTo(map);
        });

        return () => {
            map.remove();
        };
    }, [houses]);

    return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapView;