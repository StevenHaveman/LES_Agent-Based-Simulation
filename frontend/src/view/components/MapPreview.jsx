import React from "react";

import "../styles/MapPreview.css";
import { useNavigate } from "@tanstack/react-router";


const MapPreview = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to: "/detail" });

    };

    return (
        <div className="map-preview-half" onClick={handleClick}>
            <div className="map-preview-content">
                Klik hier voor de map met meer details
            </div>
        </div>
    );
};

export default MapPreview;