import React, { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import "../styles/detailpage.css";
import HouseholdList from "../components/HouseholdList";
import ResidentsList from "../components/ResidentsList";
import HouseholdMap from "../components/HouseholdMap.jsx";


export const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/detail",

    component: function Overview() {
        // State to hold selected residents for selected household
        const [selectedResidents, setSelectedResidents] = useState([]);

        // State to hold the ID of the currently selected household
        const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);

        // handles household and resident selection from either list or map
        const handleHouseholdSelect = (household) => {
            setSelectedHouseholdId(household.id);
            setSelectedResidents(household.residents);
        };

        return (
            <div className="parent-container">

                <div className="list-container">
                    <HouseholdList
                        onSelectResidents={setSelectedResidents}
                        onSelectHousehold={handleHouseholdSelect}
                        selectedHouseholdId={selectedHouseholdId}
                    />
                    <ResidentsList residents={selectedResidents} />
                </div>


                <div className="map-container">
                    <HouseholdMap
                        onSelectResidents={setSelectedResidents}
                        onSelectHousehold={handleHouseholdSelect}
                        selectedHouseholdId={selectedHouseholdId}
                    />
                </div>


                <div className="info-container">
                    <h3>household info</h3>
                    <h3>resident info</h3>
                </div>
            </div>
        );
    },
});