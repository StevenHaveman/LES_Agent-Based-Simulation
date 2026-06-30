const meterPerPixelAtZoom0 = 156543.03392;
const pi = 180;
const twoToThePowerOfZoom = 2;

const selectedCircleTargetPixels = 10;

const minCircleRadiusMeters = 0.5;
const maxCircleRadiusMeters = 25;

export const getZoomScaledRadiusMeters = (map, lat) => {
    if (!map || typeof lat !== 'number') {
        return minCircleRadiusMeters;
    }

    const zoom = map.getZoom();

    const metersPerPixel =
        (meterPerPixelAtZoom0 * Math.cos((lat * Math.PI) / pi)) /
        (twoToThePowerOfZoom ** zoom);

    const radius = selectedCircleTargetPixels * metersPerPixel;

    return Math.max(
        minCircleRadiusMeters,
        Math.min(maxCircleRadiusMeters, radius)
    );
};
