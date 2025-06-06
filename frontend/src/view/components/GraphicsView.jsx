import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <Graphic title="Totaal Beslissingen Dit Jaar" yAxisKey="decisions_this_year_total" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Huishoudens met Pakket (Zonnepaneel)" yAxisKey="solar_panel_households" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Prijs per Pakket (Warmtepomp)" yAxisKey="heat_pump_price" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Positieve Beslissingen (Zonnepaneel)" yAxisKey="solar_panel_positive_decisions" />
            </div>
        </div>
    );
};

export default GraphicsView;