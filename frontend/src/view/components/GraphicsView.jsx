/**
 * Component to display multiple simulation graphs.
 *
 * This component renders a collection of `Graphic` components, each displaying
 * a specific aspect of the simulation data.
 *
 * Props:
 * None
 *
 * Returns:
 * A React component that displays a grid of simulation graphs.
 */

import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <Graphic title="Solar Panel Price" yAxisKey="solar_panel_price" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Decisions For Solar Panels" yAxisKey="decisions_this_year" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Households with Solar Panels" yAxisKey="households_with_panels" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Residents for Solar Panels" yAxisKey="residents_for_panels" />
            </div>
        </div>
    );
};

export default GraphicsView;