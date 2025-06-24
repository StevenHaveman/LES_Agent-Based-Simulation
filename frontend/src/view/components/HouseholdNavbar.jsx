import "../styles/HouseholdNavbar.css";

/**
 * HouseholdNavbar component renders a navigation bar for households, allowing toggling
 * between an information tab and a decisions tab.
 *
 * @param {Object} props - The component props.
 * @param {string|null} props.householdWindow - The current state of the household window tab.
 * @param {Function} props.setHouseholdWindow - Function to update the household window state.
 * @returns {JSX.Element} The rendered HouseholdNavbar component.
 */
const HouseholdNavbar = ({ householdWindow, setHouseholdWindow }) => {
    return (
        <div className="navbar-container">
            {/* Info tab button */}
            <div
                className={`info-tab${householdWindow === "info" ? " selected" : ""}`}
                onClick={() => setHouseholdWindow("info")}
            >
                <h4> Info </h4>
            </div>
            {/* Decisions tab button */}
            <div
                className={`decisions-tab${householdWindow === "decision" ? " selected" : ""}`}
                onClick={() => setHouseholdWindow("decision")}
            >
                <h4>Decisions</h4>
            </div>
        </div>
    );
};

export default HouseholdNavbar;