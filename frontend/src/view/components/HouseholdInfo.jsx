import React, { useEffect, useState } from "react";
import "../styles/HouseholdInfo.css";
import detailController from "../../controller/DetailController.js";

const HouseholdInfo = ({ selectedHouseholdId, visible }) => {
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

    return (
        <div className="info-container">
            <div className="info">
                <h3>Naam: {selectedHousehold ? selectedHousehold.name : ""}</h3>
                <h3>Adres: {selectedHousehold ? selectedHousehold.address : ""}</h3>
            </div>
        </div>
    );
};

export default HouseholdInfo;