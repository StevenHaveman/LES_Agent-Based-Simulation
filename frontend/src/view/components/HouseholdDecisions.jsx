import React, { useEffect, useState } from "react";
import "../styles/HouseholdDecisions.css";
import detailController from "../../controller/DetailController.js";

const HouseholdDecisions = ({ selectedHouseholdId, visible }) => {
    const [households, setHouseholds] = useState([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await detailController.fetch_households();
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

    // Check of er een resident is met Solar_decision === true
    const hasSolarDecision = selectedHousehold
        ? selectedHousehold.residents.some(resident => resident.Solar_decision === true)
        : false;

    return (
        <div className="decisions-container">
            <div className="solar-panels">
                <img src="/INNO/solar_panel.png" alt="Solar Panel" className="solar_panel_icon"/>
                <h2 className={hasSolarDecision ? "text-green" : "text-red"}>
                    {hasSolarDecision ? "Yes" : "No"}
                </h2>
            </div>
        </div>
    );
};

export default HouseholdDecisions;