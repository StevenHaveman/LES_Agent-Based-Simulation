import React, { useEffect, useState } from "react";
import "../styles/HouseholdDecisions.css"
import overviewController from "../../controller/OverviewController.js";

const HouseholdDecisions = ({ selectedHouseholdId, visible }) => {
    const [households, setHouseholds] = useState([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await overviewController.fetch_households();
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };
        fetchHouseholds();
    }, []);

    if (!visible) {
        return null;
    }

    const selectedHousehold = households.find(h => h.id === selectedHouseholdId);


    const hasSolarDecision = selectedHousehold
        ? selectedHousehold.residents.some(resident => resident["Solar Panel_decision"] === true)
        : false;

    const hasHeatPumpDecision = selectedHousehold
        ? selectedHousehold.residents.some(resident => resident["Heat Pump_decision"] === true)
        : false;

    return (
        <div className="household-decisions-container">
            <div className="solar-panels">
                <img src="/INNO/solar_panel.png" alt="Solar Panel" className="solar_panel_icon"/>
                <h2 className={hasSolarDecision ? "text-green" : "text-red"}>
                    {hasSolarDecision ? "Yes" : "No"}
                </h2>
            </div>
            <div className="heat-pumps">
                <img src="/INNO/heat_pump.png" alt="Heat Pump" className="heat_pump_icon"/>
                <h2 className={hasHeatPumpDecision ? "text-green" : "text-red"}>
                    {hasHeatPumpDecision ? "Yes" : "No"}
                </h2>
            </div>
        </div>
    );
};

export default HouseholdDecisions;