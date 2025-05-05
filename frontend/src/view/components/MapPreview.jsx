/**
 * Component to display a preview of the map with a clickable area.
 *
 * Props:
 * None
 *
 * Returns:
 * A React component that displays a clickable map preview. Clicking on the preview
 * navigates the user to the detailed map view.
 */

import React from "react";
import "../styles/MapPreview.css";
import { useNavigate } from "@tanstack/react-router";

const MapPreview = () => {
    const navigate = useNavigate();

    /**
     * Handles the click event to navigate to the detailed map view.
     */
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