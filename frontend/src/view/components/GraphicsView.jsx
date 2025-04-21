import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <Graphic title="Zonnepaneelprijs over tijd" yAxisKey="solar_panel_price" />
            <Graphic title="Aantal beslissingen per jaar" yAxisKey="decisions_this_year" />
            <Graphic title="Milieu-invloed over tijd" yAxisKey="environmental_influence" />
            <Graphic title="Huishoudens met zonnepanelen" yAxisKey="households_with_panels" />
            <Graphic title="Aantal bewoners voor zonnepanelen" yAxisKey="residents_for_panels" />
        </div>
    );
};

export default GraphicsView;