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

    return (
       <div className="decisions-container">
           <div className="solar-panels">
               <h3>img </h3>
               <h3> yk</h3>
           </div>
       </div>
    );
};

export default HouseholdDecisions;