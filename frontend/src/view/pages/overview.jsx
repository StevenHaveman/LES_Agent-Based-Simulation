import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import "../styles/overviewpage.css"
import "../styles/globalPageStyles.css";

import GraphicsView from "../components/GraphicsView.jsx";


export const overviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/overview",
    component: function Overview() {
        return (
            <>
                <Navbar title={"MVP Overview"}></Navbar>
                <div className="overview-container">
                    <div className="map-container">
                        <h1> Map</h1>
                    </div>
                    <div className="graphics-container">
                        <h1> Graphics</h1>
                    </div>
                    <div className="household-container">
                        <h1> Household</h1>

                    </div>
                    <div className="resident-container">
                        <h1> Residents</h1>
                    </div>
                    <div className="parameters-container">
                        <h1> Parameters</h1>
                    </div>
                    <div className="KPI-container">
                        <h1> KPI's</h1>
                    </div>
                </div>

            </>
        );
    },
});
