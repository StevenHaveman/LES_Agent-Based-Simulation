import React from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import "../styles/global.css"
import Navbar from "../components/Navbar.jsx";
import MapPreview from "../components/MapPreview.jsx";




export const overviewRoute  = createRoute({
    getParentRoute: () => rootRoute,
    path: "/overview",
    component: function Overview() {
        return (
            <>
                <Navbar title={"MVP Overview"}></Navbar>
                <MapPreview></MapPreview>
            </>
        );
    },
});
