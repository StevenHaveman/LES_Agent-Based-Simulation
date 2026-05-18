import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MapFilterMenu.css';

const energyLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const woningTypes = [
    'Twee-onder-een-kap / rijwoning hoek',
    'Rijwoning tussen',
    'Flatwoning (overig)',
    'Appartement',
    'Maisonnette',
];

function MapFilterMenu({ selectedLabels, onToggleLabel, selectedWoningTypes, onToggleWoningType }) {
    return (
        <div className="map-filter-menu">
            <h4>Filter by Energy Label</h4>
            <div className="filter-buttons">
                {energyLabels.map(label => (
                    <button
                        key={label}
                        className={selectedLabels.includes(label) ? 'active' : ''}
                        onClick={() => onToggleLabel(label)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <h4>Filter by Woning Type</h4>
            <div className="filter-buttons">
                {woningTypes.map(type => (
                    <button
                        key={type}
                        className={selectedWoningTypes.includes(type) ? 'active' : ''}
                        onClick={() => onToggleWoningType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
}

MapFilterMenu.propTypes = {
    selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleLabel: PropTypes.func.isRequired,
    selectedWoningTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleWoningType: PropTypes.func.isRequired,
};

export default MapFilterMenu;
