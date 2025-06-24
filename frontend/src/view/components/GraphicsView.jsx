import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

/**
 * GraphicsView component renders a collection of graphical representations
 * of various data points related to solar panels, heat pumps, and household decisions.
 *
 * @returns {JSX.Element} The rendered GraphicsView component.
 */
const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            {/* Wrapper for the graphic displaying solar panel price */}
            <div className="graphic-wrapper">
                <Graphic
                    title="Solar Panel Price" // Title of the graphic
                    yAxisKey="solar_panel_price" // Key for the Y-axis data
                />
            </div>
            {/* Wrapper for the graphic displaying heat pump price */}
            <div className="graphic-wrapper">
                <Graphic
                    title="Heat Pump Price" // Title of the graphic
                    yAxisKey="heat_pump_price" // Key for the Y-axis data
                />
            </div>
            {/* Wrapper for the graphic displaying households with sustainability packages */}
            <div className="graphic-wrapper">
                <Graphic
                    title="Households with Package" // Title of the graphic
                    yAxisKey="solar_panel_households" // Key for the Y-axis data
                />
            </div>
            {/* Wrapper for the graphic displaying positive decisions for solar panels */}
            <div className="graphic-wrapper">
                <Graphic
                    title="Positive Decisions" // Title of the graphic
                    yAxisKey="solar_panel_positive_decisions" // Key for the Y-axis data
                />
            </div>
        </div>
    );
};

export default GraphicsView;