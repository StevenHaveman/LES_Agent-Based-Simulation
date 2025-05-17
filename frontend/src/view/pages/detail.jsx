import React, { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import "../styles/detailpage.css";
import HouseholdList from "../components/HouseholdList";
import ResidentsList from "../components/ResidentsList";
import HouseholdMap from "../components/HouseholdMap.jsx";
import HouseholdNavbar from "../components/HouseholdNavbar.jsx";
import HouseholdDecisions from "../components/HouseholdDecisions.jsx";
import HouseholdWindow from "../components/HouseholdWindow.jsx";


export const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/detail",

    component: function Overview() {
        const [selectedResidents, setSelectedResidents] = useState([]);
        const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
        const [showHouseholdContent, setShowHouseholdContent] = useState(false);
        const [window, setWindow] = useState("");

        const handleHouseholdSelect = (household) => {
            setSelectedHouseholdId(household.id);
            setSelectedResidents(household.residents);
        };

        const handleShowContent = () => setShowHouseholdContent(true);

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
                    <div className="household-container">
                        <div className="tabs">
                            <HouseholdNavbar window={window} setWindow={setWindow} />
                        </div>
                        <div className="household-window">
                            <HouseholdWindow
                                window={window}
                                setWindow={setWindow}
                                selectedHouseholdId={selectedHouseholdId}
                            />
                        </div>
                    </div>
                    <div className="resident-container">
                        <h3>Resident Info</h3>
                    </div>
                </div>
            </div>
        );
    },
});