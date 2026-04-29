import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({ //TODO MAKE A NEW COMPONENT FOR THIS
    iconUrl: '/INNO/household.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});

const aLabelIcon = L.icon({
    iconUrl: '/INNO/household_A_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});

const bLabelIcon = L.icon({
    iconUrl: '/INNO/household_B_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});
const cLabelIcon = L.icon({
    iconUrl: '/INNO/household_C_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});
const dLabelIcon = L.icon({
    iconUrl: '/INNO/household_D_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});
const eLabelIcon = L.icon({
    iconUrl: '/INNO/household_E_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});
const fLabelIcon = L.icon({
    iconUrl: '/INNO/household_F_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});
const gLabelIcon = L.icon({
    iconUrl: '/INNO/household_G_Label.png',
    iconSize: [16, 16],
    iconAnchor: [12, 16]
});

const MapView = ({ houses }) => {
    
    useEffect(() => {
        const map = L.map('map').setView([52.086, 4.399], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        houses.forEach(house => {
            let icon;
            switch (house.energieLabel) {
                case 'A':
                    icon = aLabelIcon;
                    break;
                case 'B':
                    icon = bLabelIcon;
                    break;
                case 'C':
                    icon = cLabelIcon;
                    break;
                case 'D':
                    icon = dLabelIcon;
                    break;
                case 'E':
                    icon = eLabelIcon;
                    break;
                case 'F':
                    icon = fLabelIcon;
                    break;
                case 'G':
                    icon = gLabelIcon;
                    break;
                default:
                    icon = defaultIcon;
            }

            L.marker([house.lat, house.lng], { icon }).addTo(map);
        });

        return () => {
            map.remove();
        };
    }, [houses]);

    return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapView;