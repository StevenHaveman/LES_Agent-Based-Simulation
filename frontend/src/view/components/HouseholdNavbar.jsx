
import "../styles/HouseholdNavbar.css";

const HouseholdNavbar = ({ householdWindow, setHouseholdWindow}) => {


    return (
        <div className="navbar-container">
            <div
                className={`info-tab-household${householdWindow === "info" ? " selected" : ""}`}
                onClick={() => setHouseholdWindow("info")}>
                <h4> Info </h4>
            </div>
            <div
                className={`decisions-tab${householdWindow === "decision" ? " selected" : ""}`}
                onClick={() => setHouseholdWindow("decision")}>
                <h4>Decisions</h4>
            </div>
        </div>
    );
};

export default HouseholdNavbar;