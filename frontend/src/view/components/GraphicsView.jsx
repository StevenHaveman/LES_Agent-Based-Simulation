import React from "react";
import "../styles/GraphicsView.css";
import Graphic from "./Graphic.jsx";

const GraphicsView = () => {
    return (
        <div className="graphics-view-container">
            <div className="graphic-wrapper">
                <Graphic title="Graphic 1" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Graphic 2" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Graphic 3" />
            </div>
            <div className="graphic-wrapper">
                <Graphic title="Graphic 4" />
            </div>
        </div>
    );
};

export default GraphicsView;