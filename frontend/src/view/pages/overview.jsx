import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import MapPreview from "../components/MapPreview.jsx";
import GraphicsView from "../components/GraphicsView.jsx";


export const overviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/overview",
    component: function Overview() {
        return (
            <>
                <Navbar title={"MVP Overview"}></Navbar>
                <div className="overview-container">
                    <MapPreview></MapPreview>
                    <GraphicsView> </GraphicsView>
                </div>
            </>
        );
    },
});
