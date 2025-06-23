import React, { useEffect, useState } from "react";
import "../styles/HouseholdInfo.css";
import overviewController from "../../controller/OverviewController.js";


const HouseholdInfo = ({ selectedHouseholdId, visible }) => {
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

    return (
        <div className="household_info-container">
                <h3>Naam: {selectedHousehold ? selectedHousehold.name : ""}</h3>
                <h3>Adres: {selectedHousehold ? selectedHousehold.address : ""}</h3>

        </div>
    );
};

export default HouseholdInfo;