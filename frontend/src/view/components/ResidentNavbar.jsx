import React, { useEffect } from "react";
import "../styles/ResidentNavbar.css";

const ResidentNavbar = ({ residentWindow, setResidentWindow}) => {

    return (
        <div className="navbar-container-resident">
            <div
                className={`info-tab-resident${residentWindow === "info-resident" ? " selected" : ""}`}
                onClick={() => setResidentWindow("info-resident")}>
                <h4> Info </h4>
            </div>
        </div>
    );
};

export default ResidentNavbar;