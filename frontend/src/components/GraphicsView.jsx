import React, { useState } from 'react';
import '../styles/GraphicsView.css';
import Graphic from './Graphic.jsx';

const GRAPH_OPTIONS = [
    { key: 'energy_label_A', label: 'Performance categories over time' },
    { key: 'co2', label: 'CO2 Emissions' },
    { key: 'kpi_stock', label: 'KPI Stock' },
    { key: 'cluster_behavior_data', label: 'Cluster behavior data' },
    { key: 'cluster_behavior_trends', label: 'Cluster averages over time' }
];

const GraphicsView = () => {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedGraphs, setSelectedGraphs] = useState([
        'cluster_behavior_data',
        'co2',
        'kpi_stock'
    ]);

    const handleGraphChange = (idx, newKey) => {
        if (selectedGraphs.includes(newKey)) return; // Prevents selecting the same graph
        const newGraphs = [...selectedGraphs];
        newGraphs[idx] = newKey;
        setSelectedGraphs(newGraphs);
    };

    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <button onClick={() => setShowOptions(v => !v)}>Choose your graphs</button>
                <h3 className="graphics-title-centered">Graphs</h3>
                {showOptions && (
                    <div className="graphics-modal-overlay" onClick={() => setShowOptions(false)}>
                        <div className="graphics-options-modal" onClick={e => e.stopPropagation()}>
                            <h4 className="graphics-modal-title">Select 3 graphs to display:</h4>
                            {[0, 1, 2].map(idx => (
                                <div key={idx} className="graphic-modal-row">
                                    <label>Graph {idx + 1}:&nbsp;</label>
                                    <select
                                        value={selectedGraphs[idx]}
                                        onChange={e => handleGraphChange(idx, e.target.value)}
                                    >
                                        {GRAPH_OPTIONS.filter(opt =>
                                            !selectedGraphs.includes(opt.key) || selectedGraphs[idx] === opt.key
                                        ).map(opt => (
                                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <button style={{marginTop:'1em'}} onClick={() => setShowOptions(false)}>Close</button>
                        </div>
                    </div>
                )}
                {selectedGraphs.map((key, idx) => {
                    const option = GRAPH_OPTIONS.find(opt => opt.key === key);
                    return (
                        <Graphic
                            key={key}
                            title={option ? option.label : key}
                            yAxisKey={key}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default GraphicsView;
