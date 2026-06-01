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

function MapFilterMenu({ selectedLabels, onToggleLabel, selectedWoningTypes, onToggleWoningType, clusterMode, onToggleClusterMode, selectedClusterTypes, onToggleClusterType }) {

    const isGroupActive = (values) =>
        values.every(value => selectedLabels.includes(value));

    const handleGroupToggle = (values) => {
        values.forEach(value => onToggleLabel(value));
    };

    const buttonLabel = clusterMode ? 'Switch to performance category' : 'Switch to cluster type';

    return (
        <div className="map-filter-menu">
            {!clusterMode && (
                <>
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
                </>
            )}

            <h4>Cluster View</h4>
            <div className="filter-buttons">
                <button onClick={() => onToggleClusterMode(!clusterMode)} className={clusterMode ? 'active' : ''}>
                    {buttonLabel}
                </button>
            </div>

            {clusterMode && (
                <div className="cluster-mode-section">
                    <div className="cluster-legend">
                        <div className="cluster-legend-row">
                            <span className="cluster-dot cluster-dot-engaged" />
                            <span>Engaged</span>
                            <span className="cluster-dot cluster-dot-passive" />
                            <span>Passive</span>
                            <span className="cluster-dot cluster-dot-skeptic" />
                            <span>Skeptic</span>
                        </div>
                    </div>

                    <div>
                        <h5 className="cluster-filter-title">Filter by Cluster Type</h5>
                        <div className="filter-buttons">
                            {['Engaged', 'Passive', 'Skeptic'].map(type => (
                                <button
                                    key={type}
                                    className={selectedClusterTypes.includes(type) ? 'active' : ''}
                                    onClick={() => onToggleClusterType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

MapFilterMenu.propTypes = {
    selectedLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleLabel: PropTypes.func.isRequired,
    selectedWoningTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleWoningType: PropTypes.func.isRequired,
    clusterMode: PropTypes.bool.isRequired,
    onToggleClusterMode: PropTypes.func.isRequired,
    selectedClusterTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggleClusterType: PropTypes.func.isRequired,
};

export default MapFilterMenu;
