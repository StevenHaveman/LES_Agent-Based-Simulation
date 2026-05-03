import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MapFilterMenu.css';

const energyLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function MapFilterMenu({ selectedLabels, onToggleLabel }) {
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
    </div>
  );
}

MapFilterMenu.propTypes = {
  selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleLabel: PropTypes.func.isRequired,
};

export default MapFilterMenu;
