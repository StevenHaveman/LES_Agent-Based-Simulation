import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <Graphic title="Solar Panel Price" yAxisKey="solar_panel_price" />
            <Graphic title="Desiscions For Solarpanels" yAxisKey="decisions_this_year" />
            <Graphic title="Environmental Influence" yAxisKey="environmental_influence" />
            <Graphic title="Households with Solarpanels" yAxisKey="households_with_panels" />
            <Graphic title="Housegholds with Solarpanels" yAxisKey="residents_for_panels" />
        </div>
    );s
};

export default GraphicsView;