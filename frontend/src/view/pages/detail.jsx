import React, { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import "../styles/detailpage.css";
import HouseholdList from "../components/HouseholdList.jsx";
import ResidentsList from "../components/ResidentsList.jsx";

export const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/detail",
    component: function Overview() {
        const [selectedResidents, setSelectedResidents] = useState([]);

        return (
            <div className="parent-container">
                    <HouseholdList onSelectResidents={setSelectedResidents} />
                    <ResidentsList residents={selectedResidents} />
            </div>
        );
    },
});