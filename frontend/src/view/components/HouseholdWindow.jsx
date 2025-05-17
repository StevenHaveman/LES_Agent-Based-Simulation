import React, { useEffect, useState } from "react";
import "../styles/HouseholdWindow.css";
import detailController from "../../controller/DetailController.js";

const HouseholdWindow = ({ selectedHouseholdId }) => {
    const [households, setHouseholds] = useState([]);

    useEffect(() => {
        const fetchHouseholds = async () => {
            try {
                const data = await detailController.fetch_households(); // Backend call
                setHouseholds(data);
            } catch (error) {
                console.error('Error fetching households:', error);
            }
        };
        fetchHouseholds();
    }, []);

    // Zoek de juiste household op basis van het ID
    const selectedHousehold = households.find(h => h.id === selectedHouseholdId);

    return (
        <div className="window-container">
            <div className="info-tab">
                <h4>
                    {selectedHousehold
                        ? `${selectedHousehold.name} - Info`
                        : "Selecteer een household"}
                </h4>
            </div>
        </div>
    );
};

export default HouseholdWindow;