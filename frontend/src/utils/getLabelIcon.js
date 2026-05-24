import L from 'leaflet';
const size = 16;
const anchorSize = 12;

const iconSize = [size, size];
const iconAnchor = [anchorSize, size];

const defaultIcon = L.icon({
    iconUrl: '/INNO/household.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});

const aLabelIcon = L.icon({
    iconUrl: '/INNO/household_A_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});

const bLabelIcon = L.icon({
    iconUrl: '/INNO/household_B_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
const cLabelIcon = L.icon({
    iconUrl: '/INNO/household_C_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
const dLabelIcon = L.icon({
    iconUrl: '/INNO/household_D_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
const eLabelIcon = L.icon({
    iconUrl: '/INNO/household_E_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
const fLabelIcon = L.icon({
    iconUrl: '/INNO/household_F_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
const gLabelIcon = L.icon({
    iconUrl: '/INNO/household_G_Label.png',
    iconSize: iconSize,
    iconAnchor: iconAnchor
});
function getLabelIcon(label) {
    if (label === undefined || label === null) { return defaultIcon; }
    const lab = String(label).trim();
    const upper = lab.toUpperCase();

    // Support both letter labels (A-G) and grouped descriptors
    switch (upper) {
        case 'A':
            return aLabelIcon;
        case 'B':
            return bLabelIcon;
        case 'C':
            return cLabelIcon;
        case 'D':
            return dLabelIcon;
        case 'E':
            return eLabelIcon;
        case 'F':
            return fLabelIcon;
        case 'G':
            return gLabelIcon;

        case 'GOOD':
            return aLabelIcon;
        case 'OK':
            return bLabelIcon;
        case 'MEDIUM':
            return dLabelIcon;
        case 'POOR':
            return eLabelIcon;
        case 'BAD':
            return gLabelIcon;
        default:
            return defaultIcon;
    }
}

export default getLabelIcon;
