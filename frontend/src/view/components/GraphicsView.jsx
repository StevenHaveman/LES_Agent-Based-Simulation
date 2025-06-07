import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <Graphic
                    title="Solar Panel Price"
                    yAxisKey="solar_panel_price"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Heat Pump Price"
                    yAxisKey="heat_pump_price"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Households with Package"
                    yAxisKey="solar_panel_households"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Positive Decisions"
                    yAxisKey="solar_panel_positive_decisions"
                />
            </div>
        </div>
    );
};

export default GraphicsView;