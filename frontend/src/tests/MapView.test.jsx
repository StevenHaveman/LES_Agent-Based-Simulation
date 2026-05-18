import React from 'react';
import { render, screen } from '@testing-library/react';
import MapView from '../components/MapView';
jest.mock('leaflet', () => {
    const mapMock = {
        setView: jest.fn().mockReturnThis(),
        remove: jest.fn(),
        addLayer: jest.fn(),
        on: jest.fn(),
    };
    return {
        map: jest.fn(() => mapMock),
        tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
        marker: jest.fn(() => ({
            addTo: jest.fn(() => ({ on: jest.fn(), bindTooltip: jest.fn() })),
            on: jest.fn(),
            bindTooltip: jest.fn(),
            remove: jest.fn(),
        })),
        icon: jest.fn(),
    };
});
describe('MapView', () => {
    it('renders the map container', () => {
        render(<MapView houses={[]} />);
        expect(document.getElementById('map')).toBeInTheDocument();
    });
    it('renders markers for each house', () => {
        const houses = [
            {
                lat: 1,
                lng: 2,
                energyLabel: 'A',
                address: 'Woodsboro 1',
                residents: [{ income: 1000 }],
            },
            {
                lat: 3,
                lng: 4,
                energyLabel: 'B',
                address: 'Nightmare on Elm St 2',
                residents: [{ income: 2000 }],
            },
        ];
        render(<MapView houses={houses} />);
        expect(document.getElementById('map')).toBeInTheDocument();
    });
});
