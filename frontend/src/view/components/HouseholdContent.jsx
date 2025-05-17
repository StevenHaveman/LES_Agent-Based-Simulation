import React, { useEffect, useState } from "react";
import "../styles/HouseholdContent.css";
import detailController from "../../controller/DetailController.js";

const HouseholdContent = ({ selectedHouseholdId, visible }) => {
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

        <h3>{selectedHousehold
            ? `${selectedHousehold.name} - Decisions `
            : "Selecteer een household"}</h3>
    );
};

export default HouseholdContent;