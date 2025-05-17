import React, { useEffect } from "react";
import "../styles/HouseholdNavbar.css";

const HouseholdNavbar = ({ window, setWindow }) => {


    return (
        <div className="navbar-container">
            <div
                className={`decisions-tab${window === "decision" ? " selected" : ""}`}
                onClick={() => setWindow("decision")}>
                <h4>Decisions</h4>
            </div>
        </div>
    );
};

export default HouseholdNavbar;