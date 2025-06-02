import React, {useState} from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import "../styles/overviewpage.css"
import "../styles/globalPageStyles.css";

import GraphicsView from "../components/GraphicsView.jsx";
import HouseholdMap from "../components/HouseholdMap.jsx";


export const overviewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/overview",
    component: function Overview() {
        const [selectedResidents, setSelectedResidents] = useState([]);
        const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
        const [selectedResidentIndex, setSelectedResidentIndex] = useState(null);
        const [householdWindow, setHouseholdWindow] = useState("");
        const [residentWindow, setResidentWindow] = useState("");

        const handleHouseholdSelect = (household) => {
            setSelectedHouseholdId(household.id);
            setSelectedResidents(household.residents);
        };



        return (
            <>
                <Navbar title={"MVP Overview"}></Navbar>
                <div className="overview-container">
                    <div className="map-container">
                        <HouseholdMap
                            onSelectResidents={setSelectedResidents}
                            onSelectHousehold={handleHouseholdSelect}
                            selectedHouseholdId={selectedHouseholdId}
                        />
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
