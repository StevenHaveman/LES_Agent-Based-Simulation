import React from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import "../styles/detailpage.css";
import HouseholdList from "../components/HouseholdList";
import ResidentsList from "../components/ResidentsList";

export const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/detail",
    component: function Overview() {
        return (
            <div className="parent-container">
                <div className="list-container">
                    <HouseholdList> </HouseholdList>
                    <ResidentsList> </ResidentsList>
                </div>
                <div className="map-container">
                    <h3>map</h3>
                </div>
                <div className="info-container">
                    <h3>household info </h3>
                    <h3> resident info</h3>
                </div>
            </div>
        );
    },
});