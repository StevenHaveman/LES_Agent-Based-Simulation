import React, {useState} from "react";
import "../styles/ResidentInfo.css";

const ResidentInfo = ({resident, visible}) => {
    if (!resident) return <div>Kies een resident om info te zien.</div>;

    return (
        <div className="info-container">
            <div className="info">
                <h3>Naam: {resident.name}</h3>
                <h3>Inkomen: {resident.income ?? ",-"}</h3>
            </div>
        </div>
    );
};

export default ResidentInfo;