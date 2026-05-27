import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MapFilterMenu.css';

const energyGroups = [
    { label: 'Good', values: ['A'] },
    { label: 'Ok', values: ['B'] },
    { label: 'Medium', values: ['C'] },
    { label: 'Poor', values: ['D', 'E'] },
    { label: 'Bad', values: ['F', 'G'] },
];

const woningTypes = [
    'Twee-onder-een-kap / rijwoning hoek',
    'Rijwoning tussen',
    'Flatwoning (overig)',
    'Appartement',
    'Maisonnette',
];

function MapFilterMenu({ selectedLabels, onToggleLabel, selectedWoningTypes, onToggleWoningType }) {
    
    const isGroupActive = (values) =>
        values.every(value => selectedLabels.includes(value));

    const handleGroupToggle = (values) => {
        values.forEach(value => onToggleLabel(value));
    };

    return (
        <div className="map-filter-menu">
            <h4>Filter by Building Performance Category</h4>
            <div className="filter-buttons">
                {energyGroups.map(group => (
                    <button
                        key={group.label}
                        className={isGroupActive(group.values) ? 'active' : ''}
                        onClick={() => handleGroupToggle(group.values)}
                    >
                        {group.label}
                    </button>
                ))}
            </div>
            <h4>Filter by Building Type</h4>
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
