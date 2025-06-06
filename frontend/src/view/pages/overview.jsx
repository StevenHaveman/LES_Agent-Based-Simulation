import React, {useState} from "react";
import {createRoute} from "@tanstack/react-router";
import {rootRoute} from "./root";
import Navbar from "../components/Navbar.jsx";
import "../styles/overviewpage.css"
import "../styles/globalPageStyles.css";

import GraphicsView from "../components/GraphicsView.jsx";
import HouseholdMap from "../components/HouseholdMap.jsx";
import HouseholdWindow from "../components/HouseholdWindow.jsx";
import HouseholdNavbar from "../components/HouseholdNavbar.jsx";
import ResidentNavbar from "../components/ResidentNavbar.jsx";
import ResidentWindow from "../components/ResidentWindow.jsx";
import ResidentDropdown from "../components/ResidentDropdown.jsx";


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
                        <GraphicsView> </GraphicsView>
                    </div>
                    <div className="household-container">
                        <HouseholdNavbar
                            householdWindow={householdWindow}
                            setHouseholdWindow={setHouseholdWindow}
                        />
                        <HouseholdWindow
                            householdWindow={householdWindow}
                            setHouseholdWindow={setHouseholdWindow}
                            selectedHouseholdId={selectedHouseholdId}
                        />
                    </div>
                    <div className="resident-container">
                        <ResidentNavbar residentWindow={residentWindow} setResidentWindow={setResidentWindow}/>
                        <ResidentDropdown residents={selectedResidents}
                                          selectedResidentIndex={selectedResidentIndex}
                                          onSelectResident={setSelectedResidentIndex}> </ResidentDropdown>
                        <ResidentWindow
                            residentWindow={residentWindow}
                            setWindow={setResidentWindow}
                            residents={selectedResidents}
                            selectedResidentIndex={selectedResidentIndex}
                        />
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
