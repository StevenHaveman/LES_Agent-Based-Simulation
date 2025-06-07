import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <Graphic
                    title="Solar Panel Prijs (Start vs Einde)"
                    yAxisKey="solar_panel_price"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Heat Pump Prijs (Start vs Einde)"
                    yAxisKey="heat_pump_price"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Huishoudens met Pakket (Start vs Einde)"
                    yAxisKey="solar_panel_households"
                />
            </div>
            <div className="graphic-wrapper">
                <Graphic
                    title="Positieve Beslissingen (Start vs Einde)"
                    yAxisKey="solar_panel_positive_decisions"
                />
            </div>
        </div>
    );
};

export default GraphicsView;