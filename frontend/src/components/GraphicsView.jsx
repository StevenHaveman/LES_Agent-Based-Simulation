import React from 'react';
import '../styles/GraphicsView.css';
import Graphic from './Graphic.jsx';

/**
 * GraphicsView component renders a collection of graphical representations
 * of various data points related to solar panels, heat pumps, and household decisions.
 *
 * @returns {JSX.Element} The rendered GraphicsView component.
 */
const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <button>Options</button>
                <h2 className="graphics-title-centered">Graphs</h2>
                <Graphic
                    title="Performance categories over time"
                    yAxisKey="energy_label_A"
                />
                <Graphic
                    title="CO2 Emissions"
                    yAxisKey="co2"
                />
                <Graphic
                    title="CO2 Emissions"
                    yAxisKey="co2"
                />
            </div>
        </div>
    );
};

export default GraphicsView;
