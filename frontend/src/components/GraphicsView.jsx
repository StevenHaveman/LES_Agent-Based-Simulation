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
                <Graphic
                    title="Households energy labels over time"
                    yAxisKey="energy_label_A"
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
